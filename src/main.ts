/**
 * Entry point of the Poll-App. Renders the home screen into the DOM.
 */

import "./styles/main.css";
import { renderHome } from "./components/home";
import { requireElement } from "./utils/dom";

const APP_ROOT: HTMLElement = requireElement("app");

APP_ROOT.innerHTML = renderHome();
