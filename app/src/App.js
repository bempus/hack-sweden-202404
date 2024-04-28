import data from './data/ledamoter-2024-04-27.json'
import arvoden from './data/arvoden.json'
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [ledamoter, setLedamoter] = useState(data)
  const [filteringOn, setFilteringOn] = useState({
    Role: 'None',
    Party: 'None'
  })
  const [avgArvode, setAvgArvode] = useState(0)
  const [totalArvode, setTotalArvode] = useState(0)

  const calcArvode = ({ IsOrdförande, IsParlamentMember, ISViceOrförande }) => {
    const addPercent = (IsOrdförande || IsParlamentMember) ? arvoden.chairmanPercent / 100 : ISViceOrförande ? arvoden.viceChairmanPercent / 100 : 0
    const arvode = arvoden.base * (addPercent + 1)
    return arvode
  }

  useEffect(() => {
    let avg = 0
    ledamoter.forEach(({ IsOrdförande, ISViceOrförande, IsParlamentMember }) => {

      avg += calcArvode({ IsOrdförande, ISViceOrförande, IsParlamentMember })
    })
    setTotalArvode(avg)
    setAvgArvode(Math.round(avg / (ledamoter.length || 1)))
  }, [ledamoter])

  useEffect(() => {
    const filtered = data.filter(d => {
      const none = 'None'
      if (filteringOn.Party !== none && d.Party !== filteringOn.Party) return false
      if (filteringOn.Role !== none && !d.Roles.includes(filteringOn.Role)) return false
      return true
    })

    setLedamoter(filtered)

  }, [filteringOn])

  const filterLedamoterByRole = (Role) => {
    setFilteringOn((old) => ({ ...old, Role }))
  }
  const filterLedamoterByParty = (Party) => {
    setFilteringOn((old) => ({ ...old, Party }))
  }

  const roles = new Set()
  const parties = new Set()
  data.forEach(d => {
    Array.from(d.Roles).forEach(r => roles.add(r))
    parties.add(d.Party)
  })



  const list = ledamoter.map(({ Name, Party, Gender, Roles, IsGovernmentMember, ISViceOrförande, IsOrdförande, IsParlamentMember }) => {
    const arvode = calcArvode({ ISViceOrförande, IsOrdförande, IsParlamentMember })
    const uniqueRoles = new Set()
    return (<li>
      <div className="info">
        <div className="info-left">

          <div>{Name}</div>
          <div>{Gender}</div>
        </div>
        <div className="info-right">
          <div>Party: <span className='clickable' onClick={()=>filterLedamoterByParty(Party)}>{Party}</span></div>
          <div className="arvode">
            SEK {arvode.toLocaleString('sv')}
          </div>
        </div>
      </div>
      <div className="tag-container">{Array.from(Roles).map(role => {
        if (uniqueRoles.has(role)) return null;
        uniqueRoles.add(role);
        return <div className="tag" onClick={() => filterLedamoterByRole(role)}>{role}</div>
      })}</div>
    </li>)
  })

  return (
    <div className="App">
      <div className="container">
        <h1>Statistik ledamöters arvoden</h1>
      </div>
      <div className="container">
        <h2>Filters</h2>
        <div className="filters">
          <div className='input-container'>
            <label>Role</label>
            <select value={filteringOn.Role} onChange={(e) => filterLedamoterByRole(e.target.value)}>
              <option value="None">None</option>
              {
                Array.from(roles).map(role => <option value={role}>{role}</option>)
              }
            </select>
          </div>
          <div className='input-container'>
            <label>Party</label>
            <select value={filteringOn.Party} onChange={(e) => filterLedamoterByParty(e.target.value)}>
              <option value="None">None</option>
              {
                Array.from(parties).map(p => <option value={p}>{p}</option>)
              }
            </select>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="meta">
          <div class="results">
            <span>Results: <strong>{ledamoter.length}</strong></span>
            <div>Men: <strong>{((ledamoter.filter(ledamot => ledamot.Gender === 'man').length / ledamoter.length) * 100 || 0).toFixed(2)}%</strong></div>
            <div>Women: <strong>{((ledamoter.filter(ledamot => ledamot.Gender === 'kvinna').length / ledamoter.length)*100 || 0).toFixed(2)}%</strong></div>
          </div>
          <div>
            <div>Average arvode: <strong>SEK {avgArvode.toLocaleString('sv')}</strong></div>
            <div>Total arvode: <strong>SEK {totalArvode.toLocaleString('sv')}</strong></div>
          </div>
        </div>
      </div>

      <div className="statistics-container">
        <ul className="statistics">
          {list.length ? list : <li>No results</li>}
        </ul>
      </div>
    </div>
  );
}

export default App;
