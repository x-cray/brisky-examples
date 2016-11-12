'use strict'
require('./style.css')

const render = require('brisky/render')
const s = require('vigour-state/s')

const WORKSPACE_MODE_DATA_SOURCES = 'data-sources'
const WORKSPACE_MODE_DESIGNER = 'designer'
const WORKSPACE_MODE_STYLER = 'styler'

const contentDomains = ['sports', 'movies', 'kids', 'music']
const dataSources = ['movie', 'movies-feed', 'scoreboard', 'subscriptions']
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
    created: new Date(),
    contentDomains: contentDomains,
    contentDomain: domain,
    workspace: {
      mode: WORKSPACE_MODE_DESIGNER
    }
  }
}

function getModeSwitchButton (name, mode) {
  return {
    tag: 'li',
    link: {
      tag: 'a',
      text: name,
      props: { href: 'javascript:void(0)' },
      class: {
        selected: {
          $: '$test',
          $test: state => state.mode && state.mode.compute() === mode,
          $transform: true
        }
      },
      on: {
        click: (e, stamp) => e.state.set({ mode: mode }, stamp)
      }
    }
  }
}

function getWorkspacePane (header, mode, contents) {
  return {
    $: '$test',
    $test: state => state.mode && state.mode.compute() === mode,
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
  link: {
    tag: 'a',
    text: {
      $: 'name'
    },
    props: { href: 'javascript:void(0)' },
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
  $: 'workspace',
  tag: 'ul',
  class: 'control tabs',
  dataSourcesMode: getModeSwitchButton('Data Sources', WORKSPACE_MODE_DATA_SOURCES),
  designerMode: getModeSwitchButton('Designer', WORKSPACE_MODE_DESIGNER),
  stylerMode: getModeSwitchButton('Styler', WORKSPACE_MODE_STYLER)
}

const workspace = {
  $: 'workspace',
  class: 'workspace',
  dataSources: getWorkspacePane(
    'Data Sources Configuration',
    WORKSPACE_MODE_DATA_SOURCES, {

    }
  ),
  designer: getWorkspacePane(
    'Designer',
    WORKSPACE_MODE_DESIGNER, {
    }
  ),
  styler: getWorkspacePane(
    'This page allows you to change your app style',
    WORKSPACE_MODE_STYLER, {
      header: {
        tag: 'p',
        text: 'Pick your color palette below'
      },
      colors: {
        class: 'palette',
        swatch1: { style: { backgroundColor: '#f15d58' } },
        swatch2: { style: { backgroundColor: '#363635' } },
        swatch3: { style: { backgroundColor: '#83bf17' } },
        swatch4: { style: { backgroundColor: '#a68f58' } },
        swatch5: { style: { backgroundColor: '#dcddcd' } }
      }
    }
  )
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
