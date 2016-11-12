'use strict'
require('./style.css')

const render = require('brisky/render')
const s = require('vigour-state/s')

const WORKSPACE_MODE_DESIGNER = 'designer'
const WORKSPACE_MODE_STYLER = 'styler'

const contentTypes = ['sports', 'movies', 'kids', 'music']
const dataSources = {
  sports: [''],
  movies: ['movies feed'],
  kids: ['cartoons feed'],
  music: []
}
const layouts = {
  sports: ['layout 1', 'layout 2'],
  movies: ['layout 1', 'layout 2'],
  kids: ['layout 1', 'layout 2']
}
const components = {

}

function getNewProject (name) {
  return {
    name,
    created: new Date(),
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

const state = s({
  projects: {
    mtv: getNewProject('MTV App'),
    demo: getNewProject('Demo')
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

const modeSwitch = {
  $: 'workspace',
  tag: 'ul',
  class: 'tabs',
  designerMode: getModeSwitchButton('Designer', WORKSPACE_MODE_DESIGNER),
  stylerMode: getModeSwitchButton('Styler', WORKSPACE_MODE_STYLER)
}

const workspace = {
  $: 'workspace',
  designer: {
    $: '$test',
    $test: state => state.mode && state.mode.compute() === WORKSPACE_MODE_DESIGNER,
    class: 'workspace',
    header: {
      tag: 'h3',
      text: 'Designer'
    }
  },
  styler: {
    $: '$test',
    $test: state => state.mode && state.mode.compute() === WORKSPACE_MODE_STYLER,
    class: 'workspace',
    header: {
      tag: 'h3',
      text: 'This page allows you to change your app style'
    },
    palette: {
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
  }
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
      modeSwitch
    },
    workspace
  }
}

document.body.appendChild(render(dashboardApp, state))
