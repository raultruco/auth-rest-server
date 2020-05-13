import config from 'config';

/**
 * Process query string pagination and sorting parameters.
 * Query String parameters:
 * - sort: sorting field, optionally preceded with - or + to get descending or ascending results respectively. 
 * - page: Page number to retrieve, starting on 1. By default: 1.
 */
export const processPaginationSorting = (req, res, next) => {
    let { page, sort } = req.query;
    page = parseInt(page) || 1;
    sort = `${sort || ''}`;

    const paginationSorting = {};
    paginationSorting.limit = config.pageLimit;
    paginationSorting.skip = ((page > 0 ? page : 1) - 1) * config.pageLimit;

    const sortParts = sort.match(/([+|-]?)(.+)/);
    if (sortParts && sortParts.length > 0 && sortParts[0] === sort) {
        paginationSorting.sortBy = sortParts[2];
        paginationSorting.sortDir = sortParts[1] === '-' ? -1 : 1;
    }
    req.paginationSorting = paginationSorting;
    next();
};

