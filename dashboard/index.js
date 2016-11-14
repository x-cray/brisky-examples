'use strict'
require('./style.css')

const render = require('brisky/render')
const s = require('vigour-state/s')

const dataSourcesPane = require('./data-sources')
const designerPane = require('./designer')
const stylerPane = require('./styler')

const WORKSPACE_MODE_DATA_SOURCES = 'data-sources'
const WORKSPACE_MODE_DESIGNER = 'designer'
const WORKSPACE_MODE_STYLER = 'styler'

const contentDomains = ['sports', 'movies', 'kids', 'music']
const dataSourceTypes = ['movie', 'movies-feed', 'scoreboard', 'subscriptions']
const layouts = ['layout 1', 'layout 2', 'layout 3']
const components = {
  player: {
    name: 'Video Player',
    contentDomains: ['sports', 'movies', 'kids', 'music']
  },
  scoreboard: {
    name: 'Scoreboard',
    contentDomains: ['sports']
  },
  list: {
    name: 'List View',
    contentDomains: ['sports', 'movies', 'kids', 'music']
  },
  artistInfo: {
    name: 'Artist Information',
    contentDomains: ['music']
  }
}

function getNewProject (name, domain = 'sports') {
  return {
    name,
    contentDomains,
    layouts,
    components,
    created: new Date(),
    dataSources: {},
    contentDomain: domain,
    workspace: {
      dataSourceTypes,
      mode: WORKSPACE_MODE_DATA_SOURCES,
      currentDataSourceType: dataSourceTypes[0],
      lastCreatedDataSource: 0
    }
  }
}

function getModeSwitchButton (name, mode) {
  return {
    $: 'workspace',
    tag: 'li',
    class: {
      selected: {
        $: '$test',
        $test: state => state.mode && state.mode.compute() === mode,
        $transform: true
      }
    },
    link: {
      tag: 'a',
      text: name,
      props: { href: 'javascript:void(0)' },
      on: {
        click: (e, stamp) => e.state.set({ mode: mode }, stamp)
      }
    }
  }
}

function getWorkspacePane (header, mode, contents) {
  return {
    $: '$test',
    $test: state => state.workspace.mode && state.workspace.mode.compute() === mode,
    header: {
      tag: 'h3',
      text: header
    },
    contents
  }
}

const state = s({
  projects: {
    mtv: getNewProject('MTV App', 'music'),
    demo: getNewProject('Demo', 'movies')
  },
  lastCreatedProject: 0
})
state.set({ selectedProject: state.projects.mtv })

const projectItem = {
  tag: 'li',
  class: {
    selected: {
      $: '$test',
      $test: {
        val: state => state.root.selectedProject && state.root.selectedProject.compute() === state,
        $: {
          $root: { selectedProject: true }
        }
      },
      $transform: true
    }
  },
  link: {
    tag: 'a',
    text: {
      $: 'name'
    },
    props: { href: 'javascript:void(0)' },
    on: {
      click: (e, stamp) => e.state.root.set({ selectedProject: e.state }, stamp)
    }
  }
}

const addNewProject = {
  tag: 'a',
  props: { href: 'javascript:void(0)' },
  text: 'add',
  on: {
    click: (e, stamp) => {
      const newProjectIndex = e.state.root.lastCreatedProject.compute() + 1
      const newProject = getNewProject('New project ' + newProjectIndex)
      e.state.root.set({
        lastCreatedProject: newProjectIndex,
        projects: { [newProjectIndex]: newProject }
      }, stamp)
    }
  }
}

const domainSwitch = {
  tag: 'p',
  class: 'control domain-switch',
  text: 'Content Domain ',
  select: {
    $: 'contentDomains.$any',
    tag: 'select',
    child: {
      tag: 'option',
      text: { $: true },
      props: {
        value: { $: true },
        selected: {
          $: '$test',
          $test: state => state && state.compute() === state.parent.parent.contentDomain.compute()
        }
      }
    },
    on: {
      change: (e, stamp) => e.state.parent.set({ contentDomain: e.target.value }, stamp)
    }
  }
}

const modeSwitch = {
  tag: 'ul',
  class: 'control tabs',
  dataSourcesMode: getModeSwitchButton('Data Sources', WORKSPACE_MODE_DATA_SOURCES),
  designerMode: getModeSwitchButton('Designer', WORKSPACE_MODE_DESIGNER),
  stylerMode: getModeSwitchButton('Styler', WORKSPACE_MODE_STYLER)
}

const workspace = {
  class: 'workspace',
  dataSources: getWorkspacePane('Data Sources Configuration', WORKSPACE_MODE_DATA_SOURCES, dataSourcesPane),
  designer: getWorkspacePane('Designer', WORKSPACE_MODE_DESIGNER, designerPane),
  styler: getWorkspacePane('This page allows you to change your app style', WORKSPACE_MODE_STYLER, stylerPane)
}

const dashboardApp = {
  projectsListSection: {
    tag: 'section',
    class: 'projects-pane',
    header: {
      class: 'pane-header',
      text: 'Your projects ',
      addNewProject
    },
    projectsList: {
      $: '$root.projects.$any',
      tag: 'ul',
      class: 'picker',
      child: projectItem
    }
  },
  workspaceSection: {
    $: '$root.selectedProject',
    tag: 'section',
    class: 'workspace-pane',
    header: {
      class: 'pane-header',
      title: {
        tag: 'h2',
        text: {
          $: 'name'
        }
      },
      controls: {
        class: 'pane-header-controls',
        modeSwitch,
        domainSwitch
      }
    },
    workspace
  }
}

document.body.appendChild(render(dashboardApp, state))
