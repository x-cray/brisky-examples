'use strict'
require('./css/style.css')
require('./css/fontello.css')

/* globals alert */

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
  playersInfo: {
    name: 'Players Info',
    contentDomains: ['sports']
  },
  gameStats: {
    name: 'Game Stats',
    contentDomains: ['sports']
  },
  imdbInfo: {
    name: 'IMDB Movie Info',
    contentDomains: ['movies', 'kids']
  },
  artistInfo: {
    name: 'Artist Information',
    contentDomains: ['music']
  }
}

function getNewProject (name, domain = 'movies', layout = 'layout1') {
  return {
    name,
    contentDomains,
    components,
    created: new Date(),
    dataSources: {},
    contentDomain: domain,
    layout: layout,
    workspace: {
      dataSourceTypes,
      mode: WORKSPACE_MODE_DESIGNER,
      currentDataSourceType: dataSourceTypes[0],
      lastCreatedDataSource: 0
    }
  }
}

function getModeSwitchButton (mode, name) {
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
        click: (e, stamp) => e.state.set({ mode }, stamp)
      }
    }
  }
}

function getWorkspacePane (mode, contents) {
  return {
    $: '$test',
    $test: state => state.workspace.mode && state.workspace.mode.compute() === mode,
    contents
  }
}

const state = s({
  projects: {
    mtv: getNewProject('MTV App', 'music'),
    demo: getNewProject('Demo', 'sports', 'layout3')
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
    },
    publish: {
      tag: 'a',
      class: 'action',
      props: { href: 'javascript:void(0)' },
      icon: {
        tag: 'i',
        class: 'icon-publish'
      },
      on: {
        click: (e, stamp) => {
          alert(e.state.name.compute() + ' was published')
          e.event.stopPropagation()
        }
      }
    }
  }
}

const addNewProject = {
  tag: 'a',
  props: { href: 'javascript:void(0)' },
  icon: {
    tag: 'i',
    class: 'icon-plus-circled'
  },
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
  dataSourcesMode: getModeSwitchButton(WORKSPACE_MODE_DATA_SOURCES, 'Data Sources'),
  designerMode: getModeSwitchButton(WORKSPACE_MODE_DESIGNER, 'Designer'),
  stylerMode: getModeSwitchButton(WORKSPACE_MODE_STYLER, 'Styler')
}

const workspace = {
  dataSources: getWorkspacePane(WORKSPACE_MODE_DATA_SOURCES, dataSourcesPane),
  designer: getWorkspacePane(WORKSPACE_MODE_DESIGNER, designerPane),
  styler: getWorkspacePane(WORKSPACE_MODE_STYLER, stylerPane)
}

const dashboardApp = {
  $: '$root',
  projectsListSection: {
    tag: 'section',
    class: 'projects-pane',
    header: {
      class: 'pane-header',
      text: 'Your Projects ',
      addNewProject
    },
    projectsList: {
      $: 'projects.$any',
      tag: 'ul',
      class: 'picker',
      child: projectItem
    }
  },
  workspaceSection: {
    $: 'selectedProject',
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
