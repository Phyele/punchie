import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

const ROWS = 12
const COLS = 80

const ROW_LABELS = ['12', '11', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

type Grid = boolean[][]

function createEmptyGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(false))
}

export function PunchCardEditor() {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid)
  const [isPainting, setIsPainting] = useState(false)
  const [paintValue, setPaintValue] = useState(true)

  const toggle = useCallback((row: number, col: number, value: boolean) => {
    setGrid(prev => {
      const next = prev.map(r => [...r])
      next[row][col] = value
      return next
    })
  }, [])

  const handleMouseDown = (row: number, col: number) => {
    const newValue = !grid[row][col]
    setPaintValue(newValue)
    setIsPainting(true)
    toggle(row, col, newValue)
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (!isPainting) return
    toggle(row, col, paintValue)
  }

  const handleMouseUp = () => setIsPainting(false)

  const clear = () => setGrid(createEmptyGrid())

  const punchedCount = grid.flat().filter(Boolean).length

  return (
    <div
      className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-10 select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between w-full max-w-[1200px]">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Punch Card Editor</h1>
          <p className="text-sm text-slate-500 mt-0.5">IBM 80-column · {punchedCount} hole{punchedCount !== 1 ? 's' : ''} punched</p>
        </div>
        <Button variant="outline" onClick={clear} className="text-slate-600">
          Clear
        </Button>
      </div>

      {/* Card */}
      <div
        className="relative bg-[#f5f0dc] rounded-sm shadow-lg border border-[#d4c89a] overflow-hidden"
        style={{
          // Notched top-left corner
          clipPath: 'polygon(18px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 18px)',
        }}
      >
        {/* Top band */}
        <div className="bg-[#4a7c9e] h-5 w-full" />

        {/* Card body */}
        <div className="px-4 pt-2 pb-3">
          {/* Column numbers — every 5 */}
          <div className="flex mb-1 ml-7">
            {Array.from({ length: COLS }, (_, i) => (
              <div
                key={i}
                className="text-[7px] text-[#8a7a50] font-mono leading-none text-center"
                style={{ width: 10 }}
              >
                {(i + 1) % 5 === 0 ? i + 1 : ''}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {grid.map((row, ri) => (
            <div key={ri} className="flex items-center gap-0.5 mb-0.5">
              {/* Row label */}
              <div className="w-6 text-right text-[8px] font-mono text-[#8a7a50] shrink-0 pr-1">
                {ROW_LABELS[ri]}
              </div>

              {/* Cells */}
              <div className="flex gap-0">
                {row.map((punched, ci) => (
                  <div
                    key={ci}
                    className="cursor-pointer"
                    style={{ width: 10, height: 14, padding: 1 }}
                    onMouseDown={() => handleMouseDown(ri, ci)}
                    onMouseEnter={() => handleMouseEnter(ri, ci)}
                  >
                    <div
                      className="w-full h-full rounded-[2px] transition-colors duration-75"
                      style={{
                        background: punched ? '#1a1a2e' : 'transparent',
                        boxShadow: punched
                          ? 'inset 0 1px 2px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(0,0,0,0.15)'
                          : undefined,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Bottom column numbers */}
          <div className="flex mt-1 ml-7">
            {Array.from({ length: COLS }, (_, i) => (
              <div
                key={i}
                className="text-[7px] text-[#8a7a50] font-mono leading-none text-center"
                style={{ width: 10 }}
              >
                {(i + 1) % 5 === 0 ? i + 1 : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom band */}
        <div className="bg-[#4a7c9e] h-2 w-full" />
      </div>

      <p className="mt-4 text-xs text-slate-400">Click or drag to punch · click a hole to remove it</p>
    </div>
  )
}
