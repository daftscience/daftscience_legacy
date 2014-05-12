drop table if exists Gallery;
create table Gallery (
	id integer primary key autoincrement,
    	image text not null,
        catagory text not null,
        location text not null,
        thumbLocation text not null
);
