/**
 * Document view component.
 * @module components/theme/View/CollectionView
 */

import React from 'react';
import { Helmet } from '@plone/volto/helpers';
import { Container, Item } from 'semantic-ui-react';

import { find } from 'lodash';

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { getBaseUrl } from '@plone/volto/helpers';
import { ListingBlockBody } from '@plone/volto/components';
import cx from 'classnames';

/**
 * List view component class.
 * @function CollectionView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */

const CollectionView = (props) => {
  const { content, location } = props;

  let path = content['@id']
    .replace(config.settings.internalApiPath, '')
    .replace(config.settings.apiPath, '');

  path = getBaseUrl(path);
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

  const listingBlockVariation = config.blocks.blocksConfig.listing.variations.find(
    (template) => template.id === listingBlockProps.variation,
  );

  return (
    <Container>
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
            <div className={cx('block listing', listingBlockProps.variation)}>
              <ListingBlockBody
                properties={content}
                path={path ?? location.pathname}
                data={listingBlockProps}
                isEditMode={false}
                variation={listingBlockVariation}
              />
            </div>
          </Item.Group>
        </div>
      </section>
    </Container>
  );
};
export default CollectionView;
