import { useEffect, useMemo } from 'react'
import CytoscapeComponent from 'react-cytoscapejs'
import { usePrex } from '@prex0/prex-react'
import { LoadingIndicatorDark } from '../components/common'
import { ERC20_ADDRESS } from '../constants'

function GraphView() {
  const { allHistory, loadAllHistory } = usePrex()

  useEffect(() => {
    loadAllHistory(ERC20_ADDRESS)
  }, [loadAllHistory])

  const elements = useMemo(() => {
    if (allHistory === null) {
      return []
    }

    const nodes = allHistory
      .map(history => {
        return [
          {
            data: {
              id: history.sender,
              label: history.senderDisplayName
            }
          },
          {
            data: {
              id: history.recipient,
              label: history.recipientDisplayName
            }
          }
        ]
      })
      .flat()

    const edges = allHistory
      .map(history => {
        const amount = parseInt(history.amount)
        return {
          data: {
            source: history.sender,
            target: history.recipient,
            label: ''
          },
          style: {
            width: amount > 7 ? 7 : amount,
            lineColor: 'green'
          }
        }
      })
      .filter(edge => edge.data.source !== edge.data.target)

    return nodes.concat(edges as any)
  }, [allHistory])

  if (allHistory === null) {
    return (
      <div>
        <LoadingIndicatorDark />
      </div>
    )
  }

  const cyStylesheet = [
    {
      selector: 'node',
      style: {
        label: 'data(label)',
        color: 'white',
        width: 20,
        height: 20,
        shape: 'circle',
        backgroundColor: '#555',
        borderColor: '#aaa',
        borderWidth: 2,
        fontSize: 8
      }
    },
    {
      selector: 'edge',
      style: {
        width: 1,
        lineColor: 'green'
      }
    }
  ]
  return (
    <div className="bg-black w-full h-full">
      <h1>Social Graph</h1>
      <CytoscapeComponent
        elements={elements}
        layout={{
          name: 'concentric',
          fit: true,
          padding: 30
        }}
        className="w-full h-full"
        cy={cy => cy.style(cyStylesheet)}
      />
    </div>
  )
}

export default GraphView
