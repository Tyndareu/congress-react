import { useEffect, useState } from 'react'
import Header from './header'
import ListGroup from 'react-bootstrap/ListGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import states from './states.json'
import Spinner from 'react-bootstrap/Spinner'

const KEY = 'QziPqLEQCaI1cI9ngA3NfTu7tUihuBCIYauTHncB'
const tab = <>&nbsp;&nbsp;&nbsp;&nbsp;</>

const congressYear = []
let partyCount = []

for (let i = 118; i > 101; i--) {
  congressYear.push(i)
}

export default function GetData ({ type }) {
  const [filters, setFilters] = useState({
    R: true,
    D: true,
    I: true
  })
  const [senatorsFilters, setSenatorsFilters] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [senators, setSenators] = useState(null)
  const [stateFilter, setStateFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState([118])

  // FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.propublica.org/congress/v1/${yearFilter}/${type}/members.json`,
          {
            method: 'GET',
            withCredentials: true,
            headers: { 'X-API-Key': KEY }
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        const data = await response.json();
        setSenators(data.results[0].members);
        setError(null);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isLoading, yearFilter, type])

  if (isLoading) {
    return (
      <div className='App'>
        <Header />
        <h4 className='mt-3'>Loading...</h4>
        <Spinner animation='border' variant='primary' />
      </div>
    )
  }

  const tryAgain = () => {
    setIsLoading(true)
  }

  if (error) {
    return (
      <div className='App'>
        <Header />
        <h3 className='mt-5'>{`Error: ${error}`}</h3>
        <button className='btn btn-primary' onClick={tryAgain}>
          Try Again
        </button>
      </div>
    )
  }
  // FETCH END

  // FILTERS
  const handleOnCheckbox = (e) => {
    setFilters({
      ...filters,
      [e.target.value]: e.target.checked
    })
    if (e.target.checked) {
      const filtersRDI = senators.filter((x) => x.party === e.target.value)

      setSenatorsFilters([...senatorsFilters, ...filtersRDI])
    } else {
      const filtersRDI = senatorsFilters.filter(
        (x) => x.party !== e.target.value
      )
      setSenatorsFilters([...filtersRDI])
    }
  }

  let senatorsUsersChecked = senators
  let senatorsUsers

  const handleOnStateFilter = (e) => {
    const filtersStates = e.target.id
    setStateFilter(filtersStates)
  }

  const handleOnYearFilter = (e) => {
    const yearSelect = e.target.id
    setYearFilter(yearSelect)
    setStateFilter('All')
    setIsLoading(true)
  }

  if (senatorsFilters.length !== 0) {
    senatorsUsersChecked = senatorsFilters
  }
  senatorsUsersChecked.sort(
    (x, y) => y.votes_with_party_pct - x.votes_with_party_pct
  )
  if (stateFilter !== 'All') {
    senatorsUsers = senatorsUsersChecked.filter((x) => x.state === stateFilter)
    partyCount = senators.filter((x) => x.state === stateFilter)
  } else {
    senatorsUsers = senatorsUsersChecked
    partyCount = senators
  }

  const notAllowed = {
    R: false,
    D: false,
    I: false
  }
  if (partyCount.filter((x) => x.party === 'ID').length === 0) {
    notAllowed.I = true
  }
  if (partyCount.filter((x) => x.party === 'D').length === 0) {
    notAllowed.D = true
  }
  if (partyCount.filter((x) => x.party === 'R').length === 0) {
    notAllowed.R = true
  }
  // FILTERS END

  return (
    <>
      <Header />
      <ListGroup horizontal>
        <ListGroup.Item variant='primary'>
          {type.toLocaleUpperCase()}
        </ListGroup.Item>
        <ListGroup.Item variant='light'>
          Total: {senators.length}
        </ListGroup.Item>
        <ListGroup.Item variant='light'>
          Repub.: {senators.filter((x) => x.party === 'R').length}
        </ListGroup.Item>
        <ListGroup.Item variant='light'>
          Democr.: {senators.filter((x) => x.party === 'D').length}
        </ListGroup.Item>
        <ListGroup.Item variant='light'>
          Indep.: {senators.filter((x) => x.party === 'ID').length}
        </ListGroup.Item>
      </ListGroup>

      {/* dropdown filters */}
      <div style={{ display: 'flex' }}>
        <DropdownButton
          id='dropdown-basic-button'
          title={'Congress ' + yearFilter}
        >
          {congressYear.map((item) => (
            <Dropdown.Item
              id={item}
              key={item}
              href={'#' + item}
              onClick={handleOnYearFilter}
            >
              {'Congress ' + item}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton
          style={{ maxHeight: '28px' }}
          id='dropdown-basic-button'
          title={'State : ' + stateFilter}
        >
          <Dropdown.Item
            id='All'
            key='All'
            href='#All'
            onClick={handleOnStateFilter}
          >
            All States
          </Dropdown.Item>
          <div className='dropDownScrool'>
            {states.map((item) => (
              <Dropdown.Item
                id={item.abbreviation}
                key={item.name}
                href={'#' + item.name}
                onClick={handleOnStateFilter}
              >
                {item.name}
              </Dropdown.Item>
            ))}
          </div>
        </DropdownButton>
      </div>
      <div className='container-fluit mt-3' style={{align:'left'}}>
        <div>
          <label>
            <input
              onChange={handleOnCheckbox}
              type='checkbox'
              name='filterChecbox'
              id='rFilter'
              key='rFilter'
              value='R'
              disabled={notAllowed.R}
            />
            {tab}Republicans ({partyCount.filter((x) => x.party === 'R').length}
            )
          </label>
          {tab}
          <label>
            <input
              onChange={handleOnCheckbox}
              type='checkbox'
              name='filterChecbox'
              id='dFilter'
              key='dFilter'
              value='D'
              disabled={notAllowed.D}
            />
            {tab}
            Democrats ({partyCount.filter((x) => x.party === 'D').length})
          </label>
          {tab}
          <label>
            <input
              onChange={handleOnCheckbox}
              type='checkbox'
              name='filterChecbox'
              id='idFilter'
              key='idFilter'
              value='ID'
              disabled={notAllowed.I}
            />
            {tab}
            Independents ({partyCount.filter((x) => x.party === 'ID').length})
          </label>
        </div>
      </div>

      {/* checkbox End */}
      <div className='container-fluit mt-3' style={{align:'left'}}>
        <div className='row'>
          <div className='col-md-12'>
            <table className='table table-primary'>
              <thead className='thead-dark' align='center'>
                <tr>
                  <th scope='col'>Name</th>
                  <th scope='col'>Party</th>
                  <th scope='col'>State</th>
                  <th scope='col'>Seniority</th>
                  <th scope='col' className='bg-dark text-white'>
                    Votes with Party %
                  </th>
                </tr>
              </thead>
              <tbody align='center'>
                {senatorsUsers.map((item) => (
                  <tr
                    key={item.id + item.party + item.last_updated}
                    className='table-secondary'
                  >
                    <td>{item.first_name}</td>
                    <td>{item.party}</td>
                    <td>{item.state}</td>
                    <td>{item.seniority}</td>
                    <td className='bg-secondary text-white'>
                      {item.votes_with_party_pct}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
