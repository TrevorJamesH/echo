import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Link} from 'react-router'

import TabbedContentTable from 'src/common/components/TabbedContentTable'
import {showLoad, hideLoad} from 'src/common/actions/app'
import {findProjects} from 'src/common/actions/project'
import {findUsers} from 'src/common/actions/user'
import {findPhasesWithProjects} from 'src/common/actions/phase'
import {userCan} from 'src/common/util'

class PhaseListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {selectedTabIndex: 0}
    this.handleSelectTab = this.handleSelectTab.bind(this)
  }

  componentDidMount() {
    this.props.showLoad()
    this.props.fetchData()
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isBusy && nextProps.loading) {
      this.props.hideLoad()
    }
  }

  handleSelectTab(tabIndex) {
    let currentState = this.state
    currentState.selectedTabIndex = tabIndex
    this.setState(currentState)
  }

  model = {
    name: {type: String},
    goalTitle: {title: 'Goal', type: String},
    hasArtifact: {title: 'Artifact?', type: String},
    memberHandles: {title: 'Members', type: String},
  }

  render() {
    const {isBusy, currentUser, phases, projects, tabs} = this.props
    const selectedTabIndex = this.state.selectedTabIndex
    const source = isBusy ? null : projects[selectedTabIndex]
    return isBusy ? null : (
      <TabbedContentTable
        title= 'Phases'
        model= {this.model}
        tabs= {tabs}
        selectedTabIndex={selectedTabIndex}
        source={source}
        handleSelectTab={this.handleSelectTab}
        onClickImport={this.handleClickImport}
        />
    )
  }
}

PhaseListContainer.propTypes = {
  users: PropTypes.array.isRequired,
  phases: PropTypes.array.isRequired,
  isBusy: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  showLoad: PropTypes.func.isRequired,
  hideLoad: PropTypes.func.isRequired,
}

PhaseListContainer.fetchData = fetchData

function fetchData(dispatch) {
  dispatch(findUsers())
  dispatch(findPhasesWithProjects())
}

function mapStateToProps(state) {
  console.log('container state',state)
  const {app, auth, users, phases} = state
  const {users: usersById} = users
  const {phases: phasesById} = phases
  const phaseList = Object.values(phasesById)
  phaseList.sort( (a,b) => a.number - b.number )
  // console.log('phaseList',phaseList)
  const tabs = phaseList.map( phase => 'Phase ' + phase.number)

  const projects = phaseList.map( phase => {
    return phase.currentProjects.map( project => {
      return {
        name: project.name,
        goalTitle: project.goal.title,
        hasArtifact: project.artifactURL,
        memberHandles: project.memberIds
      }
    })
  })
  // console.log('projects',projects)
  return {
    isBusy: phases.isBusy || users.isBusy,
    loading: app.showLoading,
    currentUser: auth.currentUser,
    phases: phaseList,
    projects: projects,
    tabs: tabs
  }
}

function mapDispatchToProps(dispatch) {
  return {
    navigate: path => dispatch(push(path)),
    showLoad: () => dispatch(showLoad()),
    hideLoad: () => dispatch(hideLoad()),
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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(PhaseListContainer)
