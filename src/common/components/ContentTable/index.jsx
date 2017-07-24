import React, {Component, PropTypes} from 'react'
import Table from 'react-toolbox/lib/table'
import Button from 'react-toolbox/lib/button'

import {deepClone, sortByAttr} from 'src/common/util'
import theme from './theme.scss'
import themeSelect from './themeSelect.scss'

export default class ContentTable extends Component {
  constructor() {
    super()
    this.state = {
      sortBy: null,
      direction: 1
    }
    this.handleClickSort = this.handleClickSort.bind(this)
  }

  handleClickSort(event) {
    const currentState = this.state
    if (currentState.sortBy === event.target.name) {
      currentState.direction *= -1
    } else {
      currentState.direction = 1
      currentState.sortBy = event.target.name
    }
    this.setState(currentState)
  }

  addButtonsToModel(model) {
    const newModel = deepClone(model)
    Object.keys(newModel).forEach(fieldName => {
      const title = newModel[fieldName].title || fieldName
      const arrow = this.state.direction === 1 ? ' ▼' : ' ▲'
      const buttonTitle = this.state.sortBy === fieldName ? title + arrow : title
      newModel[fieldName].title = (<Button label={buttonTitle} name={fieldName} onClick={this.handleClickSort} flat/>)
    })
    return newModel
  }

  render() {
    const {allowSelect, onSelectRow, model, source} = this.props
    const {sortBy, direction} = this.state
    const secondarySortAttribute = Object.keys(model)[0]
    const sortedSource = direction === 1 ? sortByAttr(source, sortBy, secondarySortAttribute) : sortByAttr(source, sortBy).reverse()

    const buttonModel = this.addButtonsToModel(model)

    return (
      <Table
        {...this.props}
        source={sortedSource}
        model={buttonModel}
        theme={allowSelect ? themeSelect : theme}
        onRowClick={allowSelect ? onSelectRow : null}
        selectable={false}
        multiSelectable={false}
        />
    )
  }
}

ContentTable.propTypes = {
  model: PropTypes.object.isRequired,
  source: PropTypes.array.isRequired,
  allowSelect: PropTypes.bool,
  onSelectRow: PropTypes.func,
}
