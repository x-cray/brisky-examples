'use strict'

module.exports = {
  header: {
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
      link: {
        tag: 'a',
        text: { $: true },
        props: { href: 'javascript:void(0)' },
        delete: {
          tag: 'a',
          class: 'action icon remove',
          props: { href: 'javascript:void(0)' }
        }
      }
    }
  }
}
