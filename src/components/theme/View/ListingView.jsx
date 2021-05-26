/**
 * Document view component.
 * @module components/theme/View/CollectionView
 */

import React from 'react';
import { Helmet } from '@plone/volto/helpers';
import { Container, Item } from 'semantic-ui-react';
import { map, find } from 'lodash';
import { compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
//import BlockView from './BlockView';
import ListingBlockTemplate from '@eeacms/volto-energy-theme/components/manage/Blocks/Listing/ListTemplate';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
} from '@plone/volto/helpers';
import { getBaseUrl } from '@plone/volto/helpers';
import config from '@plone/volto/registry';

/**
 * List view component class.
 * @function CollectionView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

const ListingView = (props) => {
  const { content } = props;
  const intl = props.intl;
  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);

  let url = content['@id']
    .replace(config.settings.internalApiPath, '')
    .replace(config.settings.apiPath, '');
  url = getBaseUrl(url);

  const getListingBlock = () => {
    return find(
      content[blocksLayoutFieldname].items,
      (block) => content[blocksFieldname]?.[block]?.['@type'] === 'listing',
    );
  };

  const listingBlockid = getListingBlock();

  const Block =
    config.blocks.blocksConfig[
      content[blocksFieldname]?.[listingBlockid]?.['@type']
    ]?.['view'] || null;

  return (
    <Container id="page-search" className="">
      <Helmet title={content.title} />
      <section id="content-core">
        <div className="search-listing item-listing">
          <Item.Group>
            <h1
              style={{
                marginTop: '0',
                marginLeft: '2rem',
                marginRight: '2rem',
              }}
              className="documentFirstHeading"
            >
              {content.title}
              {content.subtitle && ` - ${content.subtitle}`}
            </h1>
            {content.description && (
              <p
                style={{ marginLeft: '2rem', marginRight: '2rem' }}
                className="documentDescription"
              >
                {content.description}
              </p>
            )}
            {Block !== null ? (
              <>
                <Block
                  key={`block-${listingBlockid}`}
                  blockID={listingBlockid}
                  properties={content}
                  data={content[blocksFieldname][listingBlockid]}
                />
              </>
            ) : (
              <div key={`blocktype-${listingBlockid}`}>
                {intl.formatMessage(messages.unknownBlock, {
                  block: content[blocksFieldname]?.[listingBlockid]?.['@type'],
                })}
              </div>
            )}
          </Item.Group>
        </div>
      </section>
    </Container>
  );
};
export default compose(injectIntl)(ListingView);
