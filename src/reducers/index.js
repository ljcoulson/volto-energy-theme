/**
 * Root reducer.
 * @module reducers/root
 */

import defaultReducers from '@plone/volto/reducers';

// import folder_header from '~/reducers/folder_header';
import folder_tabs from '@eeacms/volto-energy-theme/reducers/folder_tabs';
import parent_folder_data from '@eeacms/volto-energy-theme/reducers/parent_folder_data';
import localnavigation from '@eeacms/volto-energy-theme/reducers/localnavigation';
import quicksearch from '@eeacms/volto-energy-theme/reducers/quicksearch';
import index_values from '@eeacms/volto-energy-theme/reducers/index_values';

const reducers = {
  ...defaultReducers,
  parent_folder_data,
  folder_tabs,
  localnavigation,
  quicksearch,
  index_values,
  // Add your reducers here
};

export default reducers;
