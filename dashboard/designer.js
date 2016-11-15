'use strict'

/* globals alert */

const layoutClasses = {
  layout1: 'icon-1479141909_interface-20',
  layout2: 'icon-1479141884_interface-11',
  layout3: 'icon-1479141880_interface-14',
  layout4: 'icon-1479141876_interface-13',
  layout5: 'icon-1479141873_interface-17'
}

function getLayoutSwitchButton (name) {
  return {
    tag: 'li',
    // class: {
    //   selected: {
    //     $: '$test',
    //     $test: state => state.layout && state.layout.compute() === name
    //   }
    // },
    link: {
      tag: 'a',
      props: { href: 'javascript:void(0)' },
      icon: {
        tag: 'i',
        class: layoutClasses[name]
      },
      on: {
        click: (e, stamp) => e.state.set({ layout: name }, stamp)
      }
    }
  }
}

module.exports = {
  class: 'designer-workspace-pane',
  workspace: {
    class: 'contents',
    header: {
      tag: 'h3',
      text: 'Designer'
    },
    description: {
      tag: 'p',
      text: 'Pick your preferred layout'
    },
    layouts: {
      tag: 'ul',
      class: 'layouts tabs',
      layout1: getLayoutSwitchButton('layout1'),
      layout2: getLayoutSwitchButton('layout2'),
      layout3: getLayoutSwitchButton('layout3'),
      layout4: getLayoutSwitchButton('layout4'),
      layout5: getLayoutSwitchButton('layout5')
    },
    designer: {
      class: 'app-layout-designer',
      canvas: {
        tag: 'i',
        class: {
          $: true,
          $transform: state => state.layout && layoutClasses[state.layout.compute()]
        }
      }
    }
  },
  components: {
    tag: 'section',
    class: 'designer-components-pane',
    header: {
      class: 'pane-header',
      text: 'Available Components'
    },
    componentsList: {
      $: 'components.$any',
      tag: 'ul',
      class: 'picker',
      child: {
        $: '$test',
        tag: 'li',
        $test: {
          val: state => {
            if (state && state.parent && state.parent.parent) {
              const contentDomain = state.parent.parent.contentDomain.compute()
              const componentContentDomains = state.contentDomains.compute()
              return componentContentDomains.keys().some(key => componentContentDomains[key].compute() === contentDomain)
            }
          },
          $: {
            contentDomains: true,
            $parent: {
              $parent: { contentDomain: true }
            }
          }
        },
        class: 'vertical-list-item',
        link: {
          tag: 'a',
          props: { href: 'javascript:void(0)' },
          icon: {
            tag: 'i',
            class: 'icon-book'
          },
          name: {
            tag: 'span',
            text: { $: 'name' }
          },
          on: {
            click: (e, stamp) => alert('Added ' + e.state.name.compute())
          }
        }
      }
    }
  }
}
