'use strict'
require('./style.css')

const render = require('brisky/render')
const s = require('vigour-state/s')

const contentTypes = ['sports', 'movies', 'kids']
const dataSources = {
  sports: [''],
  movies: ['movies feed'],
  kids: ['cartoons feed']
}
const layouts = {
  sports: ['layout 1', 'layout 2'],
  movies: ['layout 1', 'layout 2'],
  kids: ['layout 1', 'layout 2']
}
const components = {

}

const state = s({
  projects: {
    mtv: {
      created: new Date(),
      name: 'MTV App'
    },
    demo: {
      created: new Date(),
      name: 'Demo'
    }
  },
  lastCreatedProject: 0
})

const projectItem = {
  tag: 'li',
  link: {
    tag: 'a',
    text: {
      $: 'name'
    },
    props: { href: '#' },
    class: {
      selected: {
        $: '$test',
        $test: {
          val: state => state.root.selectedProject && state.root.selectedProject.origin() === state,
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
  props: { href: '#' },
  text: 'add',
  on: {
    click: (e, stamp) => {
      const newProjectIndex = e.state.root.lastCreatedProject.compute() + 1
      const newProject = {
        created: new Date(),
        name: 'New project ' + newProjectIndex
      }
      e.state.root.set({
        lastCreatedProject: newProjectIndex,
        projects: { [newProjectIndex]: newProject }
      }, stamp)
    }
  }
}

const workspace = {

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
    $: '$test',
    $test: {
      val: state => !!state.root.selectedProject
    },
    tag: 'section',
    class: 'workspace-pane',
    header: {
      tag: 'h2',
      class: 'pane-header',
      text: {
        $: '$root.selectedProject.name'
      }
    },
    workspace
  }
}

document.body.appendChild(render(dashboardApp, state))
