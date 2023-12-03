import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import Env from '@ioc:Adonis/Core/Env';
import { readFileSync } from 'fs';

export default class ViteProvider {
  public static needsApplication = true;

  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const View = this.app.container.resolveBinding('Adonis/Core/View');

    const served = (mainFile: string) => {
      const port = Env.get('VITE_PORT', 3000);

      const scripts = `
        <script type="module" src="http://localhost:${port}/@vite/client"></script>
        <script type="module" src="http://localhost:${port}/${mainFile}"></script>
      `;

      return scripts;
    };

    const built = (mainFile: string) => {
      const data = readFileSync('./public/build/manifest.json').toString();
      const manifest = JSON.parse(data);

      const script = `
        <script type="module" src="/build/${manifest[mainFile]['file']}"></script>
      `;

      return script;
    };

    View.registerTag({
      tagName: 'viteReactRefresh',
      seekable: false,
      block: false,
      compile(_parser, buffer) {
        if (Env.get('NODE_ENV') !== 'development') return;

        buffer.outputRaw(`
            <script type="module">
                import RefreshRuntime from 'http://localhost:3000/@react-refresh'
                RefreshRuntime.injectIntoGlobalHook(window)
                window.$RefreshReg$ = () => {}
                window.$RefreshSig$ = () => (type) => type
                window.__vite_plugin_react_preamble_installed__ = true
            </script>
        `);
      },
    });

    View.registerTag({
      tagName: 'vite',
      seekable: true,
      block: false,
      compile(parser, buffer, token) {
        const parsed = parser.utils.transformAst(
          parser.utils.generateAST(token.properties.jsArg, token.loc, token.filename),
          token.filename,
          parser
        );

        buffer.outputRaw(
          Env.get('NODE_ENV') === 'development' ? served(parsed.value) : built(parsed.value)
        );
      },
    });
  }
}
