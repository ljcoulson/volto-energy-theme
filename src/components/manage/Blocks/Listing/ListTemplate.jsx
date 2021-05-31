import React from 'react';

import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';
import config from '@plone/volto/registry';
import { Item, Breadcrumb } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const composePath = (url) => {
  return url
    .replace(config.settings.apiPath, '')
    .replace(config.settings.internalApiPath, '');
};

const ListTemplate = (props) => {
  const { items, sort_on = 'created' } = props;

  const searchItems = items?.sort(
    (a, b) => new Date(b[sort_on]) - new Date(a[sort_on]),
  );

  return (
    <div>
      {searchItems &&
        searchItems.map((item, index) => (
          <Item className="search-item" key={item['@id']}>
            <Item.Content>
              <Item.Description>
                <div className="descriptionBody">
                  <Link style={{ color: '#444' }} to={item['@id'] || item.url}>
                    <h4 className="item-description">
                      {item.description || item.title || item.Title}
                    </h4>
                  </Link>
                </div>
                <div className="searchMetadata">
                  {item.topics && (
                    <div>
                      <span className="searchLabel black">Topic:</span>{' '}
                      {item.topics?.join(', ')}
                    </div>
                  )}
                  <div>
                    <span className="searchLabel black">Published:</span>{' '}
                    <FormattedDate
                      value={item[sort_on]}
                      day="2-digit"
                      month="long"
                      year="numeric"
                    />
                  </div>
                  <div>
                    <span className="searchLabel black">Location:</span>{' '}
                    {item['@components'] &&
                      item['@components']?.breadcrumbs?.['@id'] && (
                        <Breadcrumb style={{ display: 'inline' }}>
                          {item['@components'].breadcrumbs?.['@id']
                            .split('/')
                            .slice(4, 7)
                            .map((item, index, items) => [
                              index < items.length - 1 ? (
                                <Breadcrumb.Section>
                                  <Link key={item} to={composePath(item)}>
                                    {item[0].toUpperCase() + item.substring(1)}
                                  </Link>
                                  <Breadcrumb.Divider key={`divider-${item}`} />
                                </Breadcrumb.Section>
                              ) : (
                                <Breadcrumb.Section>
                                  <Link key={item} to={composePath(item)}>
                                    {item[0].toUpperCase() + item.substring(1)}
                                  </Link>
                                </Breadcrumb.Section>
                              ),
                            ])}
                        </Breadcrumb>
                      )}
                  </div>
                </div>
              </Item.Description>
            </Item.Content>
          </Item>
        ))}
    </div>
  );
};

ListTemplate.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  linkMore: PropTypes.any,
  isEditMode: PropTypes.bool,
};

export default ListTemplate;
