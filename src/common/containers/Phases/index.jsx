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

class PhaseListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {selectedPhaseIndex: 0}
    this.handleSelectPhase = this.handleSelectPhase.bind(this)
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

  handleSelectPhase(phaseIndex) {
    let currentState = this.state
    currentState.selectedPhaseIndex = phaseIndex
    this.setState(currentState)
  }

  render() {
    console.log('this.props:', this.props)
    const {isBusy, currentUser, phases} = this.props
    return isBusy ? null : (
      <PhaseList
        selectedPhaseIndex={this.state.selectedPhaseIndex}
        phases={phases}
        handleSelectPhase={this.handleSelectPhase}
        onClickImport={this.handleClickImport}
        />
    )
  }
}

PhaseListContainer.propTypes = {
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
  console.log('state',state)
  const {app, auth, projects, users, phases} = state
  const {users: usersById} = users
  const {phases: phasesById} = phases

   const phaseList = Object.values(phasesById)

  return {
    isBusy: projects.isBusy || users.isBusy,
    loading: app.showLoading,
    currentUser: auth.currentUser,
    phases: phaseList,
  }
}

function mapDispatchToProps(dispatch) {
  console.log('dispatch',dispatch)
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
