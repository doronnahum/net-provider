import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {SetParameters, Clean, Create, CreateLocal, Delete, DeleteLocal, Read, Refresh, Update, UpdateLocal} from './actions';
import {getMapStateToProps} from './selectors';

const mapStateToProps = (state, props) => {
  return getMapStateToProps(state, props)
};

function mapDispatchToProps(dispatch) {
  return {
    _crudActions: bindActionCreators({SetParameters, Clean, Create, CreateLocal, Delete, DeleteLocal, Read, Refresh, Update, UpdateLocal}, dispatch)
  };
}
export default comp => connect(mapStateToProps, mapDispatchToProps)(comp);
