These are scripts for 2 versions of the drop-off location assignment algorithm for Grassroots Grocery.
**Location**
For each available drop-off, collect confirmed drivers for this weekend's events that don't have the current location in their restricted neighborhoods' list. 
After filtering by time slot matching, I used Moore's voting algorithm to find the most frequent location. If it is in the filtered list, then I would assign that driver. 
Else, I would assign the nearest driver by finding the closest driver's zip code from the location. 
**Driver**

