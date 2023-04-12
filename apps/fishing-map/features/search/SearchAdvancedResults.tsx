import { useSelector } from 'react-redux'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { VesselWithDatasets, selectSearchResults } from 'features/search/search.slice'
import { formatInfoField, EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import DatasetLabel from 'features/datasets/DatasetLabel'
import I18nFlag from 'features/i18n/i18nFlag'

const PINNED_COLUMN = 'shipname'

function SearchAdvancedResults({
  onSelect,
  vesselsSelected,
  setVesselsSelected,
  fetchMoreResults,
}) {
  const { t } = useTranslation()
  const searchResults = useSelector(selectSearchResults)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const columns = useMemo((): MRT_ColumnDef<VesselWithDatasets>[] => {
    return [
      {
        accessorKey: PINNED_COLUMN,
        accessorFn: ({ shipname }: VesselWithDatasets) =>
          formatInfoField(shipname, 'name') || EMPTY_FIELD_PLACEHOLDER,
        header: t('common.name', 'Name'),
        enableColumnDragging: false,
        enableColumnActions: false,
      },
      {
        accessorFn: ({ flag }: VesselWithDatasets) => <I18nFlag iso={flag} />,
        header: t('vessel.flag', 'Flag'),
      },
      {
        accessorFn: ({ mmsi }: VesselWithDatasets) => mmsi || EMPTY_FIELD_PLACEHOLDER,
        header: t('vessel.mmsi', 'MMSI'),
      },
      {
        accessorFn: ({ imo }: VesselWithDatasets) => imo || EMPTY_FIELD_PLACEHOLDER,
        header: t('vessel.imo', 'IMO'),
      },
      {
        accessorFn: ({ callsign }: VesselWithDatasets) => callsign || EMPTY_FIELD_PLACEHOLDER,
        header: t('vessel.callsign', 'Callsign'),
      },
      {
        accessorFn: ({ vesselType }: VesselWithDatasets) =>
          t(`vessel.vesselTypes.${vesselType}` as any, EMPTY_FIELD_PLACEHOLDER),
        header: t('vessel.vesselType', 'Vessel Type'),
      },
      {
        accessorFn: ({ geartype }: VesselWithDatasets) =>
          t(`vessel.gearTypes.${geartype}` as any, EMPTY_FIELD_PLACEHOLDER),
        header: t('vessel.geartype', 'Gear Type'),
      },
      {
        accessorFn: ({ dataset }: VesselWithDatasets) => <DatasetLabel dataset={dataset} />,
        header: t('vessel.source', 'Source'),
      },
    ]
  }, [t])

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        if (scrollHeight - scrollTop - clientHeight < 400) {
          fetchMoreResults()
        }
      }
    },
    [fetchMoreResults]
  )

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  if (!searchResults?.length) {
    return null
  }

  return (
    <MaterialReactTable
      columns={columns}
      data={searchResults}
      enableSorting={false}
      enableBottomToolbar={false}
      enableTopToolbar={false}
      enableColumnFilters={false}
      enablePagination={false}
      enableColumnActions
      enableColumnOrdering
      enableColumnDragging
      enableStickyHeader
      enableRowSelection
      selectAllMode="all"
      getRowId={(row) => row.id}
      initialState={{
        columnPinning: { left: [PINNED_COLUMN] },
      }}
      state={{
        rowSelection: Object.fromEntries(
          searchResults.map((vessel) => [vessel.id, vesselsSelected.includes(vessel)])
        ),
      }}
      onRowSelectionChange={undefined}
      muiTablePaperProps={{
        sx: { backgroundColor: 'transparent', height: 'auto' },
      }}
      muiTableContainerProps={{
        ref: tableContainerRef, //get access to the table container element
        sx: { height: 'calc(100vh - 60px - 52px)' }, //give the table a max height
        onScroll: (
          event //add an event listener to the table container element
        ) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
      }}
      muiSelectAllCheckboxProps={{
        onClick: () => {
          if (vesselsSelected.length === searchResults.length) {
            setVesselsSelected([])
          } else {
            setVesselsSelected(searchResults)
          }
        },
      }}
      muiSelectCheckboxProps={({ row }) => ({
        onClick: () => {
          onSelect(row.original)
        },
      })}
      muiTableBodyRowProps={({ row }) => ({
        onClick: () => {
          onSelect(row.original)
        },
        sx: { backgroundColor: 'transparent' },
      })}
      muiTableHeadCellProps={(cell) => ({
        sx: {
          font: 'var(--font-S-bold)',
          color: 'var(--color-primary-blue)',
          borderRight: 'var(--border)',
          boxShadow:
            cell.column.id === 'shipname' ? '5px 0 5px -3px var(--color-terthiary-blue)' : '',
        },
      })}
      muiTableBodyCellProps={({ row, cell }) => {
        return {
          sx: {
            font: 'var(--font-S)',
            color: 'var(--color-primary-blue)',
            backgroundColor:
              cell.column.id === 'shipname'
                ? 'var(--color-white)'
                : vesselsSelected.includes(row.original)
                ? 'var(--color-terthiary-blue)'
                : 'transparent',
            borderRight: 'var(--border)',
            borderBottom: 'var(--border)',
            boxShadow:
              cell.column.id === 'shipname' ? '5px 0 5px -3px var(--color-terthiary-blue)' : '',
            whiteSpace: 'nowrap',
            maxWidth: '20rem',
          },
        }
      }}
    />
  )
}

export default SearchAdvancedResults
