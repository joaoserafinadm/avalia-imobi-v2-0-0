import { useEffect, useState } from "react";
import { SpinnerLG } from "../src/components/loading/Spinners";
import Title from "../src/components/title/Title2";
import axios from "axios";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import baseUrl from "../utils/baseUrl";
import ClientCard from "../src/clientsManagement/ClientCard";
import Link from "next/link";
import ClientsManagementSections from "../src/clientsManagement/ClientsManagementSections";
import Pagination from "../src/clientsManagement/Pagination";
import ClientsPage from "../src/clientsManagement/ClientsPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseMedical,
  faHouseMedicalCircleCheck,
  faUserPlus,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import navbarHide from "../utils/navbarHide";
import { useDispatch } from "react-redux";
import DeleteClientModal from "../src/clientsManagement/DeleteClientModal";
import ViewClientModal from "../src/clientsManagement/ViewClientModal";
import { showModal } from "../utils/modalControl";
import { usersArray } from "../store/Users/Users.actions";
import Sections from "../src/components/Sections";
import ViewValuationModal from "../src/clientsManagement/viewValuationModal";
import MenuBar from "../src/components/menuBar";
import tippy from "tippy.js";
import { useRouter } from "next/router";
import ValuationPdf from "../src/pages/valuation/valuationPdf";
import styles from "./clientsManagement.module.scss";
import Button from "../src/components/Button";
import Input from "../src/components/Input";

export default function clientsManagement() {
  const token = jwt.decode(Cookies.get("auth"));
  const dispatch = useDispatch();
  const router = useRouter();

  const client_id = router.query.client_id;
  const modalSection = router.query.section;

  const [loadingPage, setLoadingPage] = useState(true);
  const [clientsArray, setClientsArray] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [section, setSection] = useState("Meus Clientes");
  const [searchValue, setSearchValue] = useState("");
  const [clientSelected, setClientSelected] = useState("");
  const [clientsOrder, setClientsOrder] = useState("newest");
  const [typeSearch, setTypeSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
  const [userData, setUserData] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const hasActiveFilters = searchValue || typeSearch || statusSearch;

  useEffect(() => {
    dataFunction(token.company_id);
    navbarHide(dispatch);
    const backdrop = document.querySelectorAll(".modal-backdrop.show");
    const body = document.querySelector(".modal-open");
    if (backdrop && body) {
      event.preventDefault();
      for (let i = 0; i < backdrop.length; i++) {
        backdrop[i].remove();
        body.style.overflow = "";
      }
    }
  }, []);

  useEffect(() => {
    if (client_id && allClients.length) {
      setClientSelected(allClients.find((elem) => elem._id === client_id));
      showModal("viewClientModal");
    }
  }, [client_id, allClients.length]);

  useEffect(() => {
    const newClientsArray = handleClientsArray(allClients, clientsOrder);
    setClientsArray(newClientsArray);
  }, [searchValue, clientsOrder, typeSearch, statusSearch]);

  const dataFunction = async (company_id) => {
    await axios
      .get(`${baseUrl()}/api/clientsManagement`, {
        params: { company_id, user_id: token.sub },
      })
      .then((res) => {
        const newUnitsArray = handleClientsArray(res.data.clients, clientsOrder);
        if (client_id)
          setClientSelected(newUnitsArray.find((elem) => elem._id === client_id));
        if (clientSelected)
          setClientSelected(res.data.clients.find((elem) => elem._id === clientSelected._id));
        setAllClients(newUnitsArray);
        setClientsArray(newUnitsArray);
        dispatch(usersArray(res.data.users));
        setUserData(res.data.userData);
        setLoadingPage(false);
      })
      .catch((e) => {
        setLoadingPage(false);
        console.log(e);
      });
  };

  const handleClientsArray = (clients, order) => {
    let newCLientsArray = clients;
    if (order === "newest")
      newCLientsArray = clients.slice().sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    if (order === "oldest")
      newCLientsArray = clients.slice().sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));

    if (searchValue === "" && typeSearch === "" && statusSearch === "") {
      return newCLientsArray;
    } else {
      return newCLientsArray
        .filter((elem) =>
          (elem.clientName.toLowerCase() + " " + elem.clientLastName.toLowerCase()).includes(
            searchValue.toLowerCase()
          )
        )
        .filter((elem) => (typeSearch ? elem.propertyType === typeSearch : elem))
        .filter((elem) => (statusSearch ? elem.status === statusSearch : elem));
    }
  };

  const clearFilters = () => {
    setSearchValue("");
    setTypeSearch("");
    setStatusSearch("");
    setClientsOrder("newest");
  };

  return (
    <div>
      <ViewClientModal
        modalSection={modalSection || ""}
        clientSelected={clientSelected}
        userData={userData}
        dataFunction={() => dataFunction(token.company_id)}
      />
      <DeleteClientModal
        clientSelected={clientSelected}
        dataFunction={() => dataFunction(token.company_id)}
      />
      <ViewValuationModal
        clientSelected={clientSelected}
        userData={userData}
        token={token}
        setClientSelected={(value) => setClientSelected(value)}
      />

      <Title title={"Gestão de Imóveis"} backButton="/" />

      <div className={`pagesContent-lg fadeItem`} id="pageTop">

        {/* ── Top bar ── */}
        <div className={styles.topBar}>
          {/* <div className={styles.topBarLeft}>
            <span className={styles.resultCount}>
              {clientsArray.length} imóve{clientsArray.length === 1 ? "l" : "is"} encontrado{clientsArray.length === 1 ? "" : "s"}
            </span>
          </div> */}
          <div className={styles.topBarRight}>
            <Button
              variant="secondary"
              className={`${(filtersOpen || hasActiveFilters) ? styles.filterBtnActive : ""}`}
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <FontAwesomeIcon icon={faFilter} />
              Filtros
              {hasActiveFilters && <span className={styles.filterActiveDot} />}
            </Button>
            <Link href="/clientAdd">
              <Button variant="primary">
                <FontAwesomeIcon icon={faHouseMedical} />
                Adicionar Imóvel
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Collapsible filter panel ── */}
        <div className={`${styles.filterPanel} ${filtersOpen ? styles.filterPanelOpen : ""}`}>
          <div className={styles.filterPanelInner}>
            <div className={styles.filterGrid}>

              {/* Search */}
              <Input
                type="search"
                label="Buscar"
                placeholder="Pesquisar imóvel..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />

              {/* Order */}
              <Input
                type="select"
                label="Ordenar"
                value={clientsOrder}
                onChange={(e) => setClientsOrder(e.target.value)}
                options={[
                  { value: "newest", label: "Mais recentes" },
                  { value: "oldest", label: "Mais antigos" },
                ]}
              />

              {/* Type */}
              <Input
                type="select"
                label="Tipo"
                value={typeSearch}
                onChange={(e) => setTypeSearch(e.target.value)}
                options={[
                  { value: "", label: "Todos" },
                  { value: "Apartamento", label: "Apartamento" },
                  { value: "Casa", label: "Casa" },
                  { value: "Comercial", label: "Comercial" },
                  { value: "Terreno", label: "Terreno" },
                ]}
              />

              {/* Status */}
              <Input
                type="select"
                label="Status"
                value={statusSearch}
                onChange={(e) => setStatusSearch(e.target.value)}
                options={[
                  { value: "", label: "Todos" },
                  { value: "outdated", label: "Aguardando cadastro" },
                  { value: "active", label: "Aguardando avaliação" },
                  { value: "evaluated", label: "Avaliado" },
                  { value: "answered", label: "Respondido" },
                ]}
              />

            </div>

            {hasActiveFilters && (
              <div className={styles.filterFooter}>
                <Button variant="ghost" className={styles.clearFiltersBtn} onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </div>

        <hr className={styles.divider} />

        {/* ── Main content ── */}
        <div className={styles.contentArea}>
          {loadingPage ? (
            <div className={styles.loadingWrap}>
              <SpinnerLG />
            </div>
          ) : (
            <div
              className="container carousel slide"
              data-bs-touch="false"
              data-bs-interval="false"
              id="clientsManagementSection"
            >
              <Sections
                section={section}
                idTarget="clientsManagementSection"
                setSection={(value) => setSection(value)}
                sections={["Meus Clientes", "Todos Clientes"]}
              />
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <ClientsPage
                        clients={clientsArray}
                        section="Meus Clientes"
                        user_id={token.sub}
                        setClientSelected={(value) => setClientSelected(value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <ClientsPage
                        clients={clientsArray}
                        section="Todos Clientes"
                        user_id={token.sub}
                        setClientSelected={(value) => setClientSelected(value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {clientSelected && (
          <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
            <ValuationPdf userData={userData} clientData={clientSelected} />
          </div>
        )}
      </div>
    </div>
  );
}
