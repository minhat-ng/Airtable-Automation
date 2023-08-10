## These are scripts for 2 versions of the drop-off algorithm for Grassroots Grocery.<br>
**📍Location** _version 2_<br>
For each available drop-off, 
- Collect confirmed drivers for this weekend's events that don't have the current location in their restricted neighborhoods' list. 
- After filtering by time slot matching, I used Moore's voting algorithm to find the most frequent location. If it is in the filtered list, then I would assign that driver. 
- Else, I would assign the nearest driver by finding the closest driver's zip code from the location.
<br>

**🚗Driver** _version 1_<br>
For each confirmed driver,
- Collect available locations for the current week.
- Remove locations that are in the current driver's restricted neighborhoods. 
- After filtering by time slot matching, assign the closest driver to the location using zip codes.
