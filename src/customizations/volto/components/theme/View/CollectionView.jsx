/**
 * Document view component.
 * @module components/theme/View/CollectionView
 */

import React from 'react';
import { Helmet } from '@plone/volto/helpers';
import { Container, Item } from 'semantic-ui-react';
import { find } from 'lodash';
//import BlockView from './BlockView';
import ListingBlockTemplate from '@eeacms/volto-energy-theme/components/manage/Blocks/Listing/ListTemplate';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';

/**
 * List view component class.
 * @function CollectionView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */

const ListingView = (props) => {
  const { content } = props;

  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);

  const getListingBlock = () => {
    return find(
      content[blocksLayoutFieldname].items,
      (block) => content[blocksFieldname]?.[block]?.['@type'] === 'listing',
    );
  };

  const listingBlockid = getListingBlock();

  const listingBlockProps = content[blocksFieldname]?.[listingBlockid] || {};
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
            <ListingBlockTemplate
              items={content.items}
              {...listingBlockProps}
            />
          </Item.Group>
        </div>
      </section>
    </Container>
  );
};
export default ListingView;
