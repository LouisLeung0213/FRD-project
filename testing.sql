with tem_table as 
(select post_id, max(bid_price) from testing group by post_id) 
select tem_table.post_id,tem_table.max, json_agg(src) 
from tem_table join testing 
on tem_table.post_id = testing.post_id 
group by tem_table.post_id, tem_table.max;

with tem_table as
(select post_id, json_agg(src) from testing group by post_id)
select * from tem_table;

select post_id, json_agg(src) from testing
group by post_id;
