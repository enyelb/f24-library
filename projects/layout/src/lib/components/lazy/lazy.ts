import { Component, ComponentRef, Type, ViewContainerRef, signal, input, viewChild, OnDestroy, effect } from '@angular/core';

import { F24Loader } from '../loader/loader';


/**
 * F24LazyId
 */
export type F24LazyId<C> = string | Type<C>;


/**
 * F24LazyModule
 */
export interface F24LazyModule<C> {
  (): Promise<Type<C>>
}

/**
 * F24LazyPost
 */
export interface F24LazyPost<C> {
  (component: C): void
}

/**
 * F24LazyInputs
 */
export interface F24LazyInputs {
  (): {}
}

/**
 * F24LazyComponent
 */
export interface F24LazyComponent<C> {
  (component: C): void
}

/**
 * Lazy
 */
@Component({
  selector: 'f24-lazy',
  imports: [F24Loader],
  templateUrl: './lazy.html',
  styleUrl: './lazy.scss',
  standalone: true,
})
export class F24Lazy<C> implements OnDestroy {

  /**
   * inputs
   */
  readonly inputId = input('component', { alias: 'id' });
  readonly inputModule = input<F24LazyModule<C>>(undefined, { alias: 'module' });
  readonly inputPost = input<F24LazyPost<C>>(undefined, { alias: 'post' });
  readonly inputInputs = input<F24LazyInputs>(undefined, { alias: 'inputs' });

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
  private module = signal<F24LazyModule<C> | undefined>(undefined);
  private post = signal<F24LazyPost<C> | undefined>(undefined);
  private inputs = signal<F24LazyInputs | undefined>(undefined);

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
  public component(fn?: F24LazyComponent<C>): C | undefined {
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
  public loadId(id: F24LazyId<C>): F24Lazy<C> {
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
  public loadPost(post?: F24LazyPost<C>): F24Lazy<C> {
    this.post.set(post);
    return this
  }

  /**
   * loadInputs
   * @param inputs
   * @returns
   */
  public loadInputs(inputs?: F24LazyInputs): F24Lazy<C> {
    this.inputs.set(inputs);
    return this
  }

  /**
   * load
   * @param module
   * @returns
   */
  public load(module?: F24LazyModule<C>): F24Lazy<C> {
    this.safeLoadModule(module ?? this.module());
    return this
  }

  /**
   * safeLoadModule
   */
  private safeLoadModule(module?: F24LazyModule<C>) {
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
