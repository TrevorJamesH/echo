import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Link} from 'react-router'

import PhaseList from 'src/common/components/Phases'
import {showLoad, hideLoad} from 'src/common/actions/app'
import {findProjects} from 'src/common/actions/project'
import {findUsers} from 'src/common/actions/user'
import {findPhasesWithProjects} from 'src/common/actions/phase'
import {userCan} from 'src/common/util'

import styles from './index.scss'

class PhaseListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {selectedPhaseIndex: 0}
    this.handleClickImport = this.handleClickImport.bind(this)
    this.handleSelectPhase = this.handleSelectPhase.bind(this)
  }

  componentDidMount() {
    this.props.showLoad()
    this.props.fetchData()
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (!nextProps.isBusy && nextProps.loading) {
      this.props.hideLoad()
    }
  }

  handleClickImport() {
    this.props.navigate('/projects/new')
  }

  handleSelectPhase(phaseIndex) {
    let currentState = this.state
    currentState.selectedPhaseIndex = phaseIndex
    this.setState(currentState)
  }

  render() {
    const phases = [
      {
        label: 'Phase 1',
        number: 1,
        currentProjects: ['phase 1 projects','another one']
      },
      {
        label: 'Phase 2',
        number: 2,
        currentProjects: ['phase 2 projects','another one']
      },
      {
        label: 'Phase 3',
        number: 3,
        currentProjects: ['phase 3 projects','another one']
      },
      {
        label: 'Phase 4',
        number: 4,
        currentProjects: ['phase 4 projects','another one']
      },
      {
        label: 'Phase 5',
        number: 5,
        currentProjects: ['phase 5 projects','another one']
      }
    ]

    const {isBusy, currentUser, projects} = this.props
    return isBusy ? null : (
      <PhaseList
        selectedPhaseIndex={this.state.selectedPhaseIndex}
        phases={phases}
        projects={projects}
        handleSelectPhase={this.handleSelectPhase}
        onClickImport={this.handleClickImport}
        onLoadMoreClicked={this.props.handleLoadMore}
        />
    )
  }
}

PhaseListContainer.propTypes = {
  phaseProjects: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  oldestCycleLoadedId: PropTypes.string,
  isBusy: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  handleLoadMore: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  showLoad: PropTypes.func.isRequired,
  hideLoad: PropTypes.func.isRequired,
}

PhaseListContainer.fetchData = fetchData

function fetchData(dispatch) {
  dispatch(findUsers())
  dispatch(findPhasesWithProjects())
  dispatch(findProjects())
}

function mapStateToProps(state) {
  console.log('state',state)
  const {app, auth, projects, users, phases, phaseProjects} = state
  const {projects: projectsById} = projects
  const {users: usersById} = users
  const {phases: phasesById} = phases

  const expandedProjects = Object.values(projectsById).map(project => {
    return {
      ...project,
      phase: phasesById[project.phaseId],
      members: (project.memberIds || []).map(userId => (usersById[userId] || {})),
    }
  })

  // sort by cycle, title, name
  const projectList = expandedProjects.sort((p1, p2) => {
    return (((p2.cycle || {}).cycleNumber || 0) - ((p1.cycle || {}).cycleNumber || 0)) ||
      (((p1.goal || {}).title || '').localeCompare((p2.goal || {}).title || '')) ||
      p1.name.localeCompare(p2.name)
  })

  const oldestCycleLoadedId =
    projectList.length > 0 ? projectList[projectList.length - 1].cycle.id : null

  return {
    isBusy: projects.isBusy || users.isBusy,
    loading: app.showLoading,
    currentUser: auth.currentUser,
    oldestCycleLoadedId,
    projects: projectList,
    phaseProjects: phaseProjects,
  }
}

function mapDispatchToProps(dispatch) {
  console.log('dispatch',dispatch)
  return {
    navigate: path => dispatch(push(path)),
    showLoad: () => dispatch(showLoad()),
    hideLoad: () => dispatch(hideLoad()),
    handleLoadMore: props => {
      return () => dispatch(findProjects({page: {
        cycleId: props.oldestCycleLoadedId,
        direction: 'prev',
      }}))
    },
    fetchData: props => {
      return () => fetchData(dispatch, props)
    },
  }
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const stateAndOwnProps = {...stateProps, ...ownProps}
  return {
    ...dispatchProps,
    ...stateAndOwnProps,
    fetchData: dispatchProps.fetchData(stateAndOwnProps),
    handleLoadMore: dispatchProps.handleLoadMore(stateAndOwnProps),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(PhaseListContainer)
