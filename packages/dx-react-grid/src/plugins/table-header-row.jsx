import React from 'react';
import PropTypes from 'prop-types';
import { Getter, Template, PluginContainer } from '@devexpress/dx-react-core';
import { getColumnSortingDirection, tableRowsWithHeading } from '@devexpress/dx-grid-core';

export class TableHeaderRow extends React.PureComponent {
  render() {
    const { allowSorting, allowGrouping, headerCellTemplate } = this.props;

    return (
      <PluginContainer>
        <Getter
          name="tableHeaderRows"
          pureComputed={tableRowsWithHeading}
          connectArgs={getter => [
            getter('tableHeaderRows'),
          ]}
        />
        <Template
          name="tableViewCell"
          predicate={({ row }) => row.type === 'heading'}
          connectGetters={(getter, { column }) => {
            const sorting = getter('sorting');
            const columns = getter('columns');
            const grouping = getter('grouping');

            const result = {
              sortingSupported: !column.type &&
                sorting !== undefined,
              groupingSupported: !column.type &&
                grouping !== undefined &&
                grouping.length < columns.length - 1,
            };

            if (result.sortingSupported) {
              result.sortingDirection = getColumnSortingDirection(sorting, column.name);
            }

            return result;
          }}
          connectActions={(action, { column }) => ({
            changeSortingDirection: ({ keepOther, cancel }) => action('setColumnSorting')({ columnName: column.name, keepOther, cancel }),
            groupByColumn: () => action('groupByColumn')({ columnName: column.name }),
          })}
        >
          {({ sortingSupported, groupingSupported, ...restParams }) => headerCellTemplate({
            ...restParams,
            allowSorting: allowSorting && sortingSupported,
            allowGrouping: allowGrouping && groupingSupported,
          })}
        </Template>
      </PluginContainer>
    );
  }
}

TableHeaderRow.defaultProps = {
  allowSorting: false,
  allowGrouping: false,
};

TableHeaderRow.propTypes = {
  allowSorting: PropTypes.bool,
  allowGrouping: PropTypes.bool,
  headerCellTemplate: PropTypes.func.isRequired,
};