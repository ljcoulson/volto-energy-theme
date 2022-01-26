/**
 * Document view component.
 * @module components/theme/View/CollectionView
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from '@plone/volto/helpers';
import { Container, Item, Placeholder } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import Filter from '@eeacms/volto-energy-theme/components/manage/Blocks/Listing/Filter';

import { find, map } from 'lodash';

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { getBaseUrl, hasBlocksData } from '@plone/volto/helpers';
import ListingBlockTemplate from '@eeacms/volto-energy-theme/components/manage/Blocks/Listing/ListTemplate';
import { getContentWithData } from '@eeacms/volto-energy-theme/actions';
import cx from 'classnames';

/**
 * List view component class.
 * @function CollectionView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */

const filterResults = (results = [], filterValue, facetFilter) => {
  if (!(filterValue && facetFilter)) return results;

  return results.filter((obj) =>
    (obj[facetFilter.token] || []).indexOf(filterValue) > -1 ? true : false,
  );
};

const CollectionView = (props) => {
  const { content } = props;
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  let path = content['@id']
    .replace(config.settings.internalApiPath, '')
    .replace(config.settings.apiPath, '');
  path = getBaseUrl(path);

  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);

  const getListingBlock = () => {
    return (
      content?.[blocksLayoutFieldname] &&
      find(
        content[blocksLayoutFieldname].items,
        (block) => content[blocksFieldname]?.[block]?.['@type'] === 'listing',
      )
    );
  };

  const listingBlockid = getListingBlock();

  const listingBlockItems = useSelector((state) => state.content?.subrequests);

  const items =
    listingBlockItems?.[listingBlockid]?.data?.items || content.items;

  const listingBlockProps = content[blocksFieldname]?.[listingBlockid] || {};

  useEffect(() => {
    //This is only done to get full expanded content along with metadata fields which is,
    // not possible with listing block's @querystring-search default action
    // which intern force to use two content items :(, this needs to be refactored
    const options = {
      metadata_fields: '_all',
      is_search: 1,
      //fullobjects: 1, by default?
    };
    dispatch(getContentWithData(path, null, listingBlockid, options));
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [listingBlockProps]);

  const handleSelectFilter = (ev, { name }) => {
    const filtered = filterResults(items, name, content.filter);
    if (filtered.length > 0) {
      setFilteredResults(filtered.slice(0, 15));
      setActiveFilter(name);
    }
  };

  return (
    <Container>
      <Helmet title={content.title} />
      <section id="content-core">
        <div className="search-listing item-listing">
          <Item.Group>
            <h1
              className="govuk-heading-l"
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
              {items && items.length > 0 ? (
                <>
                  <ListingBlockTemplate
                    items={filteredResults.length > 0 ? filteredResults : items}
                    {...listingBlockProps}
                    path={path}
                    isEditMode={false}
                  />
                  {content.filter ? (
                    <Filter
                      handleSelectFilter={handleSelectFilter}
                      facetFilter={content.filter}
                      selectedValue={activeFilter}
                      results={items}
                    />
                  ) : (
                    ''
                  )}
                </>
              ) : (
                <div>
                  <p>No results.</p>
                  <Placeholder>
                    <Placeholder.Header image>
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder.Paragraph>
                  </Placeholder>
                </div>
              )}
            </div>
          </Item.Group>
        </div>
      </section>
      {hasBlocksData(content) &&
        map(content[blocksLayoutFieldname].items, (block) => {
          const Block =
            config.blocks.blocksConfig[
              content[blocksFieldname]?.[block]?.['@type']
            ]?.['view'] || null;
          return Block !== null &&
            content[blocksFieldname][block]['@type'] !== 'title' ? (
            <Block
              key={block}
              id={block}
              properties={content}
              data={content[blocksFieldname][block]}
            />
          ) : (
            //   <div key={block}>
            //     {intl.formatMessage(messages.unknownBlock, {
            //       block: content[blocksFieldname]?.[block]?.['@type'],
            //     })}
            //   </div>
            ''
          );
        })}
    </Container>
  );
};
export default CollectionView;
