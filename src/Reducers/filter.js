const defaultValues = {
    filterTypes: ["0-0-0", "0-0-1", "0-0-2", "0-0-3", "0-0-5", "0-0-4"],
    filterPrice: [0, 500],
    sortBy: ['Pertinence', '- / +', '+ / -', 'A-Z']
}
export default function FilterCatalogue(filters = defaultValues, action) {
    switch(action.type) {
        case 'addTypeFilter' : {
            return {
                ...filters,
                    filterTypes: action.arrayItems,
                    infoItems: action.infoItems
            }
        }
        case 'addPriceFilter' : {
            return {
                ...filters,
                    filterPrice: action.arrayPrice
            }
        }
        default :
            return filters;
    }
}