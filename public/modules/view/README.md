# view
A HTML renderer for jillix/engine.

#### Client config example

```json
{
    "title": "Page title",
    "template": {
        "template_1": {
            "to": "#selector",
            "html": "/file_1.html",
            "render": true,
            "element": "customDataAttribute"
        },
        "template_2": {
            "to": "#selector",
            "html": "/file_2.html",
            "render": false,
            "element": "customDataAttribute"
        }
    },
    "detaultTemplate": "template_2",
    "states": {
        "stateA": [{
            "sel": "#new",
            "element": "myElement",
            "states": ["stateB"],
            "rm": ["className"],
            "add": ["className"],
            "toggle": ["className"]
        }]
    },
    "domEvents": [
        {
            "on": "click",
            "selector": "#my_clickable_1",
            "dontPrevent": true,
            "flow": "event"
        }
    ]
}
```

Don't forget to load the HTML files in the module instance config:

```json
{
    "name": "my_view_module_instance",
    "module": "view",
    "client": {
        "markup": ["/file.html"]
    }
}
```

#### HTML data attribute

The `element` flow option searches for elements that have a `data-element` attribute with that value.

```html
<div data-element="myElement"></div>
```

#### Public mehtods

* `render` (render data to a template)
* `state` (activate a state)

# Implementing standard configurations
This section covers "how to do" general configurations.


#### Navbars

The navbar will be an instance of the view module.

Practical example:
The composition file of the navbar `nav_layout`:

```json
{
  "client": {
    "config": {
      "templates": {
        "layout": {
          "to": ".one-container",
          "html": "/nav.html",
          "render": true
        }
      },
      "defaultTemplate": "layout",
      "states": {
        "resetNav": [{
            "sel": ".navbar li",
            "rm": ["active"]
          }],
        "nav": [{
            "states": ["resetNav"],
            "add": ["active"]
          }]
      },
      "domEvents": [{
          "on": "click",
          "selector": "li",
          "flow": "itemClick"
        }]
    },
    "flow": [
      [
        "itemClick",
        [":ALTR", {"data": {"url": "{event.target.href}"}}],
        ":public_router/route"
      ]
    ],
    "markup": [
      "/nav.html"
    ]
  },
  "name": "nav_layout",
  "module": "view",
  "roles": {
    "*": true
  }
}
```
The states are for adding the active class to the active `li`.
The 'domEvents' triggers the 'itemClick' event on item click.
Html navbar example `nav.html`:

```html
<ul class="navbar">
    <li><a href="faq">FAQ</a></li>
    <li><a href="features">Features</a></li>
    <li><a href="pricing">Pricing</a></li>
    <li><a href="signin">Login</a></li>
    <li><a href="signup">Sign up</a></li>
</ul>
```

To use the navbar in a view module instance it must be loaded:
```json
{
  "client": {
    "load": [
      "nav_layout",
    ],
    "config": {
    },
    "markup": [
    ]
  },
  "roles": {
    "*": true
  },
  "module": "view",
  "name": "public_layout"
}
```

#### Footer visibility on certain pages
The footer will be a module view instance

```json
{
  "client": {
    "config": {
      "templates": {
        "layout": {
          "to": "footer",
          "html": "/any_footer.html",
          "render": true
        }
      },
      "defaultTemplate": "layout",
    },
    "markup": [
      "/any_footer.html"
    ]
  },
  "name": "footer_layout",
  "module": "view",
  "roles": {
    "*": true
  }
}
```
The main html file which contains and empty footer:
```html
<div id="page-content">
    <div class="_container hide"></div>
</div>
<footer></footer>

```
In the main composition, for ex. `private_layout.json`, `footer_layout` can be loaded and states can be used to control the footer visibility:
```
{
  "client": {
    "load": [
      "footer_private_layout"
    ]
    ......
    "states": {
        "showFooter": [{
            "sel": "footer",
            "rm": ["hide"]
    }],
        "hideFooter": [{
            "sel": "footer",
            "add": ["hide"]
        }]
}
```
In a view module instance composition in which the footer must be shown or hidden, the following flow configuration can be used:
```json
    "flow": [
      [
        "renderedDOM",
        [":private_layout/state", "showFooter"],
      ]
    ]
```
or
```json
    "flow": [
      [
        "renderedDOM",
        [":private_layout/state", "hideFooter"],
      ]
    ]
```

#### Loader for loading pages
For page loader implementation the states can be used to control the loader visibility

In the main html file the loader must be present and `hide` must be the default class for the pages container:
```html
<div id="page-content">
    <div class="pages-container _container hide">
    </div>
    <div class="page-loader">Loader</div>
</div>
```
In the main composition, for ex. 'private_layout.json', states can be defined to control the loader visibility:
```json
{
    "showLoader": [{
        "sel": ".page-loader",
        "rm": ["hide"]
    }],
    "hideLoader": [{
        "sel": ".page-loader",
        "add": ["hide"]
    }],
    "showContainer": [{
        "sel": "._container",
        "rm": ["hide"]
    }],
    "hideContainer": [{
        "sel": "._container",
        "add": ["hide"]
    }],
    "displayLoader": [{
        "states": [
            "showLoader",
            "hideContainer"
            ]
    }],
    "displayContainer": [{
        "states": [
            "showContainer",
            "hideLoader"
            ]
    }]
}
```
In the compositions in which the loader is needed, the flow configuration can be used to manipulate the loader state:
```json
"flow": [
    [
        "renderedDOM",
        [":private_layout/state", "displayContainer"]
    ]
]
```
In special cases (ex. service builder, service file editor) the `renderedDOM` event will not be the right event to be used for manipulating the loader states and thus a custom event will be needed.
```json
"flow": [
    [
        "renderedGraph",
        [":private_layout/state", "displayContainer"]
    ]
]
```
#### Pages inside a certain container
If a section which contains multiple pages must be added to `container` class, states can be used to show/hide pages
```html
<div class="pages-container container hide"></div>
```
A section added to `container` can be similar to the following:
```html
<div class="app-options">
    <div class="app-dashboard hide"></div>
    <div class="app-editor hide"></div>
    <div class="app-terminal hide"></div>
</div>
```
A view module instance composition file `app_options_layout.json` can be used for the section configuration.
The `app_dashboard`, `app_editor`, `app_terminal` events from the flow configuration come from an engine-ruut module instance.
```json
"states": {
    "hide-all": [{
        "sel": ".app-options > div",
        "add": ["hide"]
    }],
    "app_dashboard": [{
        "sel": ".app-options > .app-dashboard",
        "rm": ["hide"]
    }],
    "app_editor": [{
        "sel": ".app-options > .app-editor",
        "rm": ["hide"]
    }],
    "app_terminal": [{
        "sel": ".app-options > .app-terminal",
        "rm": ["hide"]
    }]
    }
```
```json
"flow": [
    [
        "renderedDOM",
        ["LOAD", ["nav_app_layout"]]
    ],
    [
        "app_dashboard",
        ["LOAD", ["app_dashboard_layout"]],
        [":state", "hide-all"],
        [":state", "app_dashboard"],
    ],
    [
        "app_editor",
        ["LOAD", ["app_editor_layout"]],
        [":state", "hide-all"],
        [":state", "app_editor"]
    ],
    [
        "app_terminal",
        ["LOAD", ["app_terminal_layout"]],
        [":state", "hide-all"],
        [":state", "app_terminal"],
    ]
]
```
