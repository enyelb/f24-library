import { Component, ComponentRef, Type, ViewContainerRef, signal, input, viewChild, OnDestroy, effect, ViewEncapsulation } from '@angular/core';

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
  encapsulation: ViewEncapsulation.None
})
export class F24Lazy<C> implements OnDestroy {

  /**
   * componentViewContainerRef
   */
  readonly componentViewContainerRef = viewChild.required('componentViewContainerRef', { 
    read: ViewContainerRef 
  })

  /**
   * loading
   */
  protected readonly loading = signal(true);

  /**
   * catalogoRef
   */
  private componentRef?: ComponentRef<C>;

  /**
   * id es para identificar al componente que se esta cargando o que etsa cargado
   */
  private readonly id = signal('component');
  /**
   * module es el componente que cargara de manera lazy 
   */
  private readonly module = signal<F24LazyModule<C> | undefined>(undefined);
  /**
   * post es un funcion que se ejecuta despues de cargar el component
   * Nota: si el componente ya esta cargado y se llama a la funcion load nuevamente tambien se ejecutara
   */
  private readonly post = signal<F24LazyPost<C> | undefined>(undefined);
  /**
   * inputs son la lista de inputs que se le pasaran por directiva al componente
   */
  private readonly inputs = signal<F24LazyInputs | undefined>(undefined);
  /**
   * isLoadingMoudle es para saber cuando un module se esta cargando para en caso de llamar a la funcion
   * load esperar que termine la llamada anterior
   */
  private readonly isLoadingMoudle = signal(false);
  /**
   * loadingModuleAttemptsMax maximo intentos de espera que tendra el cargar modulo
   */
  private readonly loadingModuleAttemptsMax = signal(5);
  
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
    /**
     * si el id del componente cambia destruir el componente actual para que se carge otro de manera perezosa
     */
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
  private async safeLoadModule(module?: F24LazyModule<C>) {
    if (!module) {
      return;
    }

    /**
     * intentos de cargar el modulo
     */
    let loadingModuleAttempts = 0;

    /**
     * validar si ya hay un modulo cargando
     * validar si el modulo es dintino de null porque hay casos donde el module se manda a cargar pero no termina de cargar y queda en null
     */
    while(this.isLoadingMoudle() && this.module() != null){
      /**
       * esperar 2 segundos
       */
      console.log(`loading module... (Attempt: ${loadingModuleAttempts + 1})`)
      await new Promise(resolve => setTimeout(resolve, 2000));
      /**
       * incrementar los intentos
       */
      loadingModuleAttempts++;
      /**
       * validar si el numero de intentos llego al maximo
       */
      if (loadingModuleAttempts == this.loadingModuleAttemptsMax()) {
        return;
      }
    }
    /**
     * si el componente ya existe, solo se ejecuta la funcion post y sale
     */
    if (this.componentRef) {
      const fnPost = this.post();
      if (fnPost) {
        fnPost(this.componentRef.instance);
      }
      return;
    }
    /**
     * asignar el modulo actual y marcar el modulo como cargando
     */
    this.module.set(module);
    this.isLoadingMoudle.set(true);
    /**
     * crear y cargar el componente
     */
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
    this.isLoadingMoudle.set(false);
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
