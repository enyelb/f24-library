import { Component, ComponentRef, Type, ViewContainerRef, signal, input, viewChild, OnDestroy, effect } from '@angular/core';

import { Loader } from '../loader';

import { LazyComponent, LazyId, LazyInputs, LazyModule, LazyPost } from './model';

/**
 * Lazy
 */
@Component({
  selector: 'f24-lazy',
  imports: [Loader],
  templateUrl: './lazy.html',
  styleUrl: './lazy.scss',
  standalone: true,
})
export class Lazy<C> implements OnDestroy {

  /**
   * inputs
   */
  readonly inputId = input('component', { alias: 'id' });
  readonly inputModule = input<LazyModule<C>>(undefined, { alias: 'module' });
  readonly inputPost = input<LazyPost<C>>(undefined, { alias: 'post' });
  readonly inputInputs = input<LazyInputs>(undefined, { alias: 'inputs' });

  /**
   * viewChilds
   */
  readonly componentViewContainerRef = viewChild.required('componentViewContainerRef', { 
    read: ViewContainerRef 
  })

  /**
   * loading
   */
  protected loading = signal(true);

  /**
   * catalogoRef
   */
  private componentRef?: ComponentRef<C>;

  /**
   * signals
   */
  private id = signal('component');
  private module = signal<LazyModule<C> | undefined>(undefined);
  private post = signal<LazyPost<C> | undefined>(undefined);
  private inputs = signal<LazyInputs | undefined>(undefined);

  /**
   * constructor
   */
  constructor() {
    effect(() => this.id.set(this.inputId()));
    effect(() => this.module.set(this.inputModule()));
    effect(() => this.post.set(this.inputPost()));
    effect(() => this.inputs.set(this.inputInputs()));
  }
   
  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  /**
   * component
   */
  public component(fn?: LazyComponent<C>): C | undefined {
    if (!this.componentRef) {
      return undefined;
    }
    if (fn && this.componentRef) {
      fn(this.componentRef.instance);
    }
    return this.componentRef.instance;
  }

  /**
   * load
   * @param id
   * @returns
   */
  public loadId(id: LazyId<C>): Lazy<C> {
    const newId = typeof id === 'string' ? id : id.name;
    if (this.id() !== newId) {
      this.destroyComponent();
      this.id.set(newId);
    }
    return this;
  }

  /**
   * loadPost
   * @param post
   * @returns
   */
  public loadPost(post?: LazyPost<C>): Lazy<C> {
    this.post.set(post);
    return this
  }

  /**
   * loadInputs
   * @param inputs
   * @returns
   */
  public loadInputs(inputs?: LazyInputs): Lazy<C> {
    this.inputs.set(inputs);
    return this
  }

  /**
   * load
   * @param module
   * @returns
   */
  public load(module?: LazyModule<C>): Lazy<C> {
    this.safeLoadModule(module ?? this.module());
    return this
  }

  /**
   * safeLoadModule
   */
  private safeLoadModule(module?: LazyModule<C>) {
    if (!module) {
      return;
    }

    if (this.componentRef) {
      const fnPost = this.post();
      if (fnPost) {
        fnPost(this.componentRef.instance);
      }
      return;
    }

    module().then(module => this.createComponent(module));
  }

  /**
   * create component
   */
  private createComponent(module: Type<C>) {
    this.componentRef = this.componentViewContainerRef().createComponent(module);
    if (this.componentRef) {
      const fnInputs = this.inputs();
      if (fnInputs) {
        const inputs: { [key: string]: any } = fnInputs();
        for (const key of Object.keys(inputs)) {
          this.componentRef.setInput(key, inputs[key]);
        }
        this.componentRef.changeDetectorRef.detectChanges();
      }
      const fnPost = this.post();
      if (fnPost) {
        fnPost(this.componentRef.instance);
      }
    }
    this.loading.set(false);
  }

  /**
   * destroy component
   */
  private destroyComponent() {
    this.loading.set(true);
    this.componentViewContainerRef().clear();
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }

}
