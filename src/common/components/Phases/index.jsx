import React, {Component, PropTypes} from 'react'
import {Button} from 'react-toolbox/lib/button'
import FontIcon from 'react-toolbox/lib/font_icon'
import Helmet from 'react-helmet'
import {Tab, Tabs} from 'react-toolbox'

import ContentHeader from 'src/common/components/ContentHeader'
import ContentTable from 'src/common/components/ContentTable'
import {Flex} from 'src/common/components/Layout'

import styles from './index.scss'

const ProjectModel = {
  name: {type: String},
  cycleNumber: {title: 'Cycle', type: String},
  phaseNumber: {title: 'Phase', type: String},
  state: {title: 'State', type: String},
  goalTitle: {title: 'Goal', type: String},
  hasArtifact: {title: 'Artifact?', type: String},
  memberHandles: {title: 'Members', type: String},
}

export default class PhaseList extends Component {
  render() {
    const {phases, allowSelect, allowImport, onClickImport, onSelectRow, selectedPhaseIndex} = this.props
    phases.sort( (a,b) => a.number - b.number )
    const phase = phases[selectedPhaseIndex]
    const projects = phase.currentProjects

    const projectList = projects.map( project => {
      const memberHandles = (project.members || []).map(member => member.handle).join(', ')
      const cycle = project.cycle || {}
      return {
        memberHandles,
        name: project.name,
        state: cycle.state,
        goalTitle: (project.goal || {}).title,
        cycleNumber: cycle.cycleNumber,
        phaseNumber: phase.number,
        hasArtifact: project.artifactURL ? (
          <FontIcon className={styles.artifactCheck} value="check"/>
        ) : null
      }
    })
    const header = (
      <ContentHeader
        title="Phases"
        buttonIcon={allowImport ? 'add_circle' : null}
        onClickButton={allowImport ? onClickImport : null}
        />
    )

    const projectsTable = (
      <ContentTable
        model={ProjectModel}
        source={projectList}
        allowSelect={allowSelect}
        onSelectRow={allowSelect ? onSelectRow : null}
        />
    )

    const tabs = phases.map( phase => {
      return <Tab label={'Phase  '+phase.number} key={phase.number}><small>{projectsTable}</small></Tab>
    })

    const content = (
      <Tabs index={this.props.selectedPhaseIndex} onChange={this.props.handleSelectPhase} fixed>
        {tabs}
      </Tabs>
    )

    return (
      <Flex column>
        <Helmet>
          <title>Phases</title>
        </Helmet>
        {header}
        {content}
      </Flex>
    )
  }
}

PhaseList.propTypes = {
  phases: PropTypes.arrayOf(PropTypes.shape({
    currentProjects: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      goal: PropTypes.shape({
        title: PropTypes.string,
      }),
      cycle: PropTypes.shape({
        state: PropTypes.string,
        cycleNumber: PropTypes.number,
      }),
      phase: PropTypes.shape({
        number: PropTypes.number,
      }),
      members: PropTypes.arrayOf(PropTypes.shape({
        handle: PropTypes.string,
      })),
      createdAt: PropTypes.date,
    })),
  })),
  allowSelect: PropTypes.bool,
  allowImport: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onClickImport: PropTypes.func,
  onLoadMoreClicked: PropTypes.func,
}
