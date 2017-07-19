import React, {Component, PropTypes} from 'react'
import {Button} from 'react-toolbox/lib/button'
import FontIcon from 'react-toolbox/lib/font_icon'
import Helmet from 'react-helmet'
import {Tab, Tabs} from 'react-toolbox'

import ContentHeader from 'src/common/components/ContentHeader'
import ContentTable from 'src/common/components/ContentTable'
import {Flex} from 'src/common/components/Layout'

import styles from './index.scss'

export default class TabbedContentTable extends Component {
  render() {
    const {
      model,
      source,
      allowSelect,
      allowImport,
      onClickImport,
      onSelectRow,
      selectedTabIndex,
      tabs,
      title
    } = this.props

    const header = (
      <ContentHeader
        title={title}
        buttonIcon={allowImport ? 'add_circle' : null}
        onClickButton={allowImport ? onClickImport : null}
        />
    )

    const table = (
      <ContentTable
        model={model}
        source={source}
        allowSelect={allowSelect}
        onSelectRow={allowSelect ? onSelectRow : null}
        />
    )

    const tabDisplay = tabs.map( (tab, index) => {
      return <Tab label={tab} key={index}><small>{table}</small></Tab>
    })

    const tabContent = (
      <Tabs onChange={this.props.handleSelectTab} index={selectedTabIndex} fixed>
      {tabDisplay}
      </Tabs>
    )

    return (
      <Flex column>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {header}
        {tabContent}
      </Flex>
    )
  }
}

TabbedContentTable.propTypes = {

  model: PropTypes.object.isRequired,
  source: PropTypes.array.isRequired,
  tabs: PropTypes.array.isRequired,
  selectedTabIndex: PropTypes.number.isRequired,
  allowSelect: PropTypes.bool,
  allowImport: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onClickImport: PropTypes.func,
  onLoadMoreClicked: PropTypes.func,
}
