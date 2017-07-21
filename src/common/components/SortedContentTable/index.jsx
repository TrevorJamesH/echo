import React, {Component, PropTypes} from 'react'
import Table from 'react-toolbox/lib/table'
import Button from 'react-toolbox/lib/button'

import theme from './theme.scss'
import themeSelect from './themeSelect.scss'
import ContentTable from 'src/common/components/ContentTable'
import {deepClone} from 'src/common/util'
import {sortByAttr} from 'src/common/util'

export default class SortedContentTable extends Component {
  constructor(){
    super()
    this.state = {sortBy: 'name'}
    this.handleSort = this.handleSort.bind(this)
  }

  handleSort( sortBy ){
    this.setState({sortBy:sortBy})
  }

  addButtonsToModel( model ){
    const newModel = deepClone( model )
    Object.keys(newModel).forEach(entry => {
      const title = newModel[entry].title || entry
      newModel[entry].title = (<Button label={title} onMouseUp={() => this.handleSort(entry)}></Button>)
    })
    return newModel
  }

  render() {
    const {allowSelect, onSelectRow, model, source} = this.props
    const sortBy = this.state.sortBy
    const sortedSource = sortByAttr(source, sortBy)

    return (
      <ContentTable
        {...this.props}
        source={sortedSource}
        model={this.addButtonsToModel( model )}
        theme={allowSelect ? themeSelect : theme}
        onRowClick={allowSelect ? onSelectRow : null}
        selectable={false}
        multiSelectable={false}
        />
    )
  }
}

SortedContentTable.propTypes = {
  allowSelect: PropTypes.bool,
  onSelectRow: PropTypes.func,
}
