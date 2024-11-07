import { faBook, faGear, faShop, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";




export default function GeralButtons() {



    return (
        <div className="row px-3 pb-5">
            <div className="col-12 col-md-6 col-xl-3 my-2">
                <Link href="/editProfile">
                    <div className="card shadow cardAnimation" type="button">
                        <div className="card-body text-center ">
                            <span className='fs-4 bold text-secondary'>
                                <FontAwesomeIcon icon={faUser} className='me-2 small' /> Meu Perfil
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="col-12 col-md-6 col-xl-3 my-2">
                <Link href="/companyEdit">

                    <div className="card shadow cardAnimation" type="button">
                        <div className="card-body text-center">
                            <span className='fs-4 bold text-secondary'>
                                <FontAwesomeIcon icon={faShop} className='me-2 small' /> Imobiliária
                            </span>
                        </div>
                    </div>
                </Link>

            </div>
            <div className="col-12 col-md-6 col-xl-3 my-2">
                <Link href="/accountSetup">

                    <div className="card shadow cardAnimation" type="button">
                        <div className="card-body text-center">
                            <span className='fs-4 bold text-secondary'>
                                <FontAwesomeIcon icon={faGear} className='me-2 small' />Configurações
                            </span>
                        </div>
                    </div>
                </Link>

            </div>
            <div className="col-12 col-md-6 col-xl-3 my-2">
                <Link href="/tutorials">

                    <div className="card shadow cardAnimation" type="button">
                        <div className="card-body text-center">
                            <span className='fs-4 bold text-secondary'>
                                <FontAwesomeIcon icon={faBook} className='me-2 small' />Tutoriais
                            </span>
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    )
}