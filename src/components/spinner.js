import React from 'react'

const Spinner = ({ show, children }) => {
    return (
        <>
            {
                show ?
                    <div className='text-center p-4'>
                        <div className='spinner-border text-primary' role='status'>
                            <span className='visually-hidden'>Loading...</span>
                        </div>
                    </div> : <>{children}</>
            }
        </>
    )
}

export default Spinner