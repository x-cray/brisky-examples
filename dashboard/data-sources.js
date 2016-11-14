'use strict'

module.exports = {
  class: 'workspace',
  header: {
    tag: 'h3',
    text: 'Data Sources Configuration'
  },
  description: {
    tag: 'p',
    text: 'Below you may configure your data sources'
  },
  select: {
    $: 'workspace.dataSourceTypes.$any',
    tag: 'select',
    child: {
      tag: 'option',
      text: { $: true },
      props: {
        value: { $: true },
        selected: {
          $: '$test',
          $test: state => state && state.compute() === state.parent.parent.currentDataSourceType.compute()
        }
      }
    },
    on: {
      change: (e, stamp) => e.state.parent.set({ currentDataSourceType: e.target.value }, stamp)
    }
  },
  space: {
    tag: 'span',
    text: ' '
  },
  add: {
    $: 'workspace',
    tag: 'a',
    props: { href: 'javascript:void(0)' },
    text: 'add',
    on: {
      click: (e, stamp) => {
        const selectedDataSourceType = e.state.currentDataSourceType.compute()
        const newDataSourceIndex = e.state.lastCreatedDataSource.compute() + 1
        e.state.parent.set({
          workspace: {
            lastCreatedDataSource: newDataSourceIndex
          },
          dataSources: { [newDataSourceIndex]: selectedDataSourceType }
        }, stamp)
      }
    }
  },
  dataSourcesList: {
    $: 'dataSources.$any',
    tag: 'ul',
    class: 'picker',
    child: {
      tag: 'li',
      class: 'vertical-list-item',
      link: {
        tag: 'a',
        props: { href: 'javascript:void(0)' },
        icon: {
          tag: 'i',
          class: 'icon-database'
        },
        name: {
          tag: 'span',
          text: { $: true }
        },
        delete: {
          tag: 'a',
          class: 'action',
          props: { href: 'javascript:void(0)' },
          icon: {
            tag: 'i',
            class: 'icon-cancel-circled'
          },
          on: {
            click: (e, stamp) => e.state.remove(stamp)
          }
        }
      }
    }
  }
}
