import React, {Component, PropTypes} from 'react'
import {Button} from 'react-toolbox/lib/button'
import FontIcon from 'react-toolbox/lib/font_icon'
import Helmet from 'react-helmet'
import {Tab, Tabs} from 'react-toolbox'

import ContentHeader from 'src/common/components/ContentHeader'
import ContentTable from 'src/common/components/ContentTable'
import {Flex} from 'src/common/components/Layout'

import styles from './index.scss'

const PhaseModel = {
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
    const {projects, allowSelect, allowImport, onClickImport, onSelectRow} = this.props
    const projectData = projects.map(project => {
      const memberHandles = (project.members || []).map(member => member.handle).join(', ')
      const cycle = project.cycle || {}
      const phase = project.phase || {}
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
    const tabs = this.props.phases.map( phase => {
      return <Tab label={phase.label}><small>First Content</small></Tab>
    })
    const content = (
      <Tabs index={this.state.fixedIndex} onChange={this.handleFixedTabChange} fixed>
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
        <Button onClick={this.props.onLoadMoreClicked} label="Load More..." icon="keyboard_arrow_down" accent/>
      </Flex>
    )
  }
}

PhaseList.propTypes = {
  phases: PropTypes.arrayOf(PropTypes.shape({
    projects: PropTypes.arrayOf(PropTypes.shape({
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
