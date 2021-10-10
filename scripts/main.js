Vue.config.productionTip = false;
Vue.config.devtools = true;

const $root = new Vue({
  el: '#app',
  data: {
    config: {
      version: 0,
      title: null,
      module: []
    },
  },
  watch: {
    "config.title"(title) {
      if (title) {
        document.title = "Linkliste " + title;
      } else {
        document.title = "Linkliste";
      }
    }
  },
  async mounted() {
    const update = () => this.updateConfig(window.location.hash.substr(1) || "linkliste.yml");

    window.addEventListener("hashchange", update, false);
    await update();
  },
  methods: {
    async updateConfig(configURI) {
      if (!configURI || configURI === "") return;

      const req = await fetch(configURI);
      const config_yml = await req.text();
  
      const raw_config = jsyaml.load(config_yml);

      this.config.version = raw_config.version || 0;
      this.config.title = raw_config.title || null;
      this.config.module = Object.keys(raw_config.module || {})
        .sort()
        .map(name => ({ 
          name,
          ...raw_config.module[name],
        }));
    },
    truncate(input, length) {
      if (input.length > length) {
        return input.substring(0, length - 3) + '...';
      }
      return input;
    },
    getFavicon(url) {
      const url_obj = new URL(url);
      return "http://www.getfavicon.org/get.pl?url=" + url_obj.host;
    }
  }
});
