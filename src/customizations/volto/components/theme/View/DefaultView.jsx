/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

 import React from 'react';
 import PropTypes from 'prop-types';
 import { defineMessages, injectIntl } from 'react-intl';
 
 import { Container, Image } from 'semantic-ui-react';
 import { map } from 'lodash';
 import config from '@plone/volto/registry';
 
 import {
   getBlocksFieldname,
   getBlocksLayoutFieldname,
   hasBlocksData,
   getBaseUrl,
 } from '@plone/volto/helpers';
 
 const messages = defineMessages({
   unknownBlock: {
     id: 'Unknown Block',
     defaultMessage: 'Unknown Block {block}',
   },
 });
 
 /**
  * Component to display the default view.
  * @function DefaultView
  * @param {Object} content Content object.
  * @returns {string} Markup of the component.
  */
 const DefaultView = ({ content, intl, location }) => {
   const blocksFieldname = getBlocksFieldname(content);
   const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
 
   return (
     <div id="page-document" className="govuk-width-container">
       <Container id="page-document">
       <h1 className="govuk-heading-l">{content.title}</h1>
       {content.description && (
         <p className="govuk-heading-m">{content.description}</p>
       )}
       {content.image && (
         <Image
           className="document-image"
           src={content.image.scales.thumb.download}
           floated="right"
         />
       )}
       {content.remoteUrl && (
         <span>
           The link address is:
           <a href={content.remoteUrl}>{content.remoteUrl}</a>
         </span>
       )}
       {content.text && (
         <div
           dangerouslySetInnerHTML={{
             __html: content.text.data,
           }}
         />
       )}
     </Container>
    </div>
   );
 };
 
 /**
  * Property types.
  * @property {Object} propTypes Property types.
  * @static
  */
 DefaultView.propTypes = {
   /**
    * Content of the object
    */
   content: PropTypes.shape({
     /**
      * Title of the object
      */
     title: PropTypes.string,
     /**
      * Description of the object
      */
     description: PropTypes.string,
     /**
      * Text of the object
      */
     text: PropTypes.shape({
       /**
        * Data of the text of the object
        */
       data: PropTypes.string,
     }),
   }).isRequired,
 };
 
 export default injectIntl(DefaultView);
 