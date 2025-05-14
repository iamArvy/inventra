declare module "*.vue" {
    import { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  
  declare function route(name: string, params?: Record<string, any>, absolute?: boolean): string;