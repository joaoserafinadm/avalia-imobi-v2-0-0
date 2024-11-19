import { useRouter } from "next/router";
import Title from "../../src/components/title/Title2";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import navbarHide from "../../utils/navbarHide";
import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import baseUrl from "../../utils/baseUrl";
import { SpinnerLG, SpinnerSM } from "../../src/components/loading/Spinners";
import ClientInfo from "../../src/clientsManagement/ClientInfo";
import Sections from "../../src/components/Sections";
import ValuationConfig from "../../src/valuation/ValuationConfig";
import PropertyAdd from "../../src/valuation/PropertyAdd";
import { closeModal, showModal } from "../../utils/modalControl";
import { FixedTopicsBottom } from "../../src/components/fixedTopics";
import Link from "next/link";
import isMobile from "../../utils/isMobile";
import scrollTo from "../../utils/scrollTo";
import ShowValuationModal from "../../src/valuationPage/ShowValuationModal";
import { createImageUrlFromLink } from "../../utils/createImageUrlFromLink";



export default function ValuationPage(props) {

    const token = jwt.decode(Cookies.get("auth"));


    const router = useRouter();
    const dispatch = useDispatch()

    const [client, setClient] = useState()
    const [propertyArray, setPropertyArray] = useState([])
    const [valuationCalc, setValuationCalc] = useState('')
    const [calcVariables, setCalcVariables] = useState({
        valorIdealRange: 0,
        curtoPrazoRange: 7,
        longoPrazoRange: 7,
        calcPrivativa: true
    })

    const [propertyArrayError, setPropertyArrayError] = useState('')

    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingSave, setLoadingSave] = useState(false)
    const [section, setSection] = useState('Configurar avaliação')

    const [valuationUrl, setValuationUrl] = useState('')

    const [clientData, setClientData] = useState('')
    const [userData, setUserData] = useState('')





    useEffect(() => {
        if (propertyArray.length >= 2) setPropertyArrayError('')
    }, [propertyArray.length])






    const { _id } = router.query;

    useEffect(() => {
        navbarHide(dispatch)
    }, [])

    useEffect(() => {
        if (_id) {

            dataFunction(token.company_id)
        }
    }, [_id])

    const dataFunction = async (company_id) => {


        await axios.get(`${baseUrl()}/api/valuation`, {
            params: {
                company_id,
                user_id: token.sub,
                client_id: _id
            }
        }).then(res => {
            setClient(res.data.client)
            setLoadingPage(false)
        }).catch(e => {
            console.log(e)
        })



    }


    const validate = () => {

        let propertyArrayError = ''

        if (propertyArray?.length < 2) propertyArrayError = "Adicione pelo menos 2 imóveis para comparação"

        if (propertyArrayError) {
            setPropertyArrayError(propertyArrayError)
            scrollTo("clientManage")
            return false
        } else {
            return true
        }
    }


    const handleSave = async (company_id) => {
        setSection('Configurar avaliação');

        const isValid = validate();

        if (isValid) {
            setLoadingSave(true);

            // Extrai as URLs de imagem do propertyArray
            const imageUrls = propertyArray
                .filter(property => property.imageUrl) // Considerando que o campo de imagem se chama 'imageUrl'
                .map(property => property.imageUrl);

            try {
                // Faz o upload das imagens e obtém os novos links
                const uploadedImages = await createImageUrlFromLink(imageUrls, "CLIENT_FILES"); // Substitua "nome_do_preset" pelo seu preset do Cloudinary

                // Substitui as URLs antigas pelas novas URLs no propertyArray
                const updatedPropertyArray = propertyArray.map(property => {
                    const uploadedImage = uploadedImages.find(img => img.original_url === property.imageUrl);
                    return uploadedImage ? { ...property, imageUrl: uploadedImage.cloudinary_url } : property;
                });

                // Monta o objeto de dados com o propertyArray atualizado
                const data = {
                    company_id,
                    user_id: token.sub,
                    client_id: _id,
                    propertyArray: updatedPropertyArray,
                    calcVariables,
                    valuationCalc
                };

                // Envia os dados para a API
                const response = await axios.post(`${baseUrl()}/api/valuation`, data);
                setLoadingSave(false);
                setValuationUrl(response.data.urlToken);
                setClientData(response.data.clientData)
                setUserData(response.data.userData)
                router.push('/clientsManagement?client_id=' + _id + '&section=Avaliação')

                // showModal('showValuationModal');

            } catch (e) {
                console.log("Erro ao carregar imagens ou salvar avaliação:", e);
                setLoadingSave(false);
            }
        }
    };


    return (
        <div >
            <Title title={client && client?.clientName + " " + client?.clientLastName} subtitle="Avaliação do imóvel" backButton='/' />


            <ShowValuationModal valuationUrl={valuationUrl} token={token} userData={userData} clientData={clientData} />


            {loadingPage ?
                <SpinnerLG />
                :
                <div className="pagesContent-lg shadow fadeItem" id="pageTop">
                    <div className="container carousel  " data-bs-touch="false" data-bs-interval='false' id="clientManage">

                        <Sections section={section} idTarget="clientManage"
                            setSection={value => setSection(value)}
                            sections={["Configurar avaliação", "Informações do imóvel"]} />


                        <div className="carousel-inner ">
                            <div className="carousel-item active">
                                <ValuationConfig client={client} propertyArrayError={propertyArrayError}
                                    setCalcVariables={value => setCalcVariables(value)}
                                    calcVariables={calcVariables}
                                    propertyArray={propertyArray} setPropertyArray={value => setPropertyArray(value)}
                                    setValuationCalc={value => setValuationCalc(value)}
                                    valuationCalc={valuationCalc}
                                />

                            </div>
                        </div>
                        <div className="carousel-inner ">
                            <div className="carousel-item ">
                                <ClientInfo client={client} />
                            </div>
                        </div>
                    </div>

                    {
                        <>
                        </>
                    }

                    {!isMobile() && <hr />}



                    <FixedTopicsBottom >

                        <div className="row">
                            <div className="col-12 d-flex justify-content-end align-items-center">
                                <Link href="/clientsManagement">
                                    <button className="btn btn-sm btn-secondary">Cancelar</button>
                                </Link>

                                <button className="btn btn-sm btn-orange ms-2"
                                    onClick={() => handleSave(token.company_id)} disabled={propertyArray.length === 0 || loadingSave}>
                                    {loadingSave ?
                                        <SpinnerSM />
                                        :
                                        "Salvar"
                                    }
                                </button>





                            </div>
                        </div>
                    </FixedTopicsBottom>


                </div>


            }
        </div>
    )



}