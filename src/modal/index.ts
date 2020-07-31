import State from './lib/State';
import { getChromeStorageApi } from './../utils/chromeRequest/index';
import ModalList from './component/ModalList';
// instantiate classes
const AppState = new State();
const modalList = new ModalList();

getChromeStorageApi(['todos'], function(todos) {
  AppState.update({todos}) //initialize state
});

AppState.addObserver(modalList);

modalList.render(AppState.get(), "modal-todos");
