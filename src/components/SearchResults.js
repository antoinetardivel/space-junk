import React from 'react';

const MaxSearchResults = 10;

const filterResults = (stations, search) => {
    if (!stations) return null;
    if (!search || search === '') return null;

    const regex = new RegExp(search, 'i');

    return stations.filter(station => regex.test(station.name)).slice(0, MaxSearchResults);
}


const SearchResults = ({stations, search, onResultClick}) => {
    
    const results = filterResults(stations, search);

    if (!results) return null;
    
    return (
        <div className='ResultsWrapper'>
            { results.map((result, i) => <StationPreview name={result.name + i} station={result} onClick={onResultClick} />)}
        </div>
    )
}

export const StationPreview = ({station, onClick, onRemoveClick, className}) => {

    const id = station.satrec && station.satrec.satnum;

    return (
        <div className={'Result ' + (className || '')} onClick={e => onClick && onClick(station)}>
            <p>
                <span title={id ? 'NORAD ID: ' + id : null}>{station.name}</span>
                {onRemoveClick && <span className='RemoveButton' onClick={e => onRemoveClick(station)}>x</span>}
            </p>
        </div>
    )
}

export default SearchResults;