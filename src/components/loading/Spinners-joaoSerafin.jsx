



export function SpinnerLG(props) {

    return (
        <div className="col-12 d-flex justify-content-center align-items-center "
            style={{ height: "350px" }} >
            <div
                className="spinner-border text-secondary"
                style={{ width: "50px", height: "50px" }}
                role="status"
            >
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}
export function SpinnerSM(props) {

    return (

        <div className={`spinner-border spinner-border-sm ${props.className}`} role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    )
}