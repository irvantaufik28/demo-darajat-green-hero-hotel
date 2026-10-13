export const STATIC_ROOM_MEDIA_ID = "34fa6412-487c-4afc-a3a4-b04dd7cd289f";
export const SECOND_STATIC_ROOM_MEDIA_ID = "0151244e-11b3-479d-b705-119fa555d65d";
export const THIRD_STATIC_ROOM_MEDIA_ID = "f54f7dc7-0a18-45d3-bc75-bb124d3d90bb";
export const FOURTH_STATIC_ROOM_MEDIA_ID = "cecdf003-e876-492f-a8c8-41574897d1e3";

export const staticRoomImages = [
  {
    id: `${STATIC_ROOM_MEDIA_ID}-02`,
    url: `/images/rooms/${STATIC_ROOM_MEDIA_ID}/02-room-overview.png`,
    altText: "Tampilan menyeluruh interior kamar bernuansa kayu",
    isCover: true,
    sortOrder: 0,
  },
  {
    id: `${STATIC_ROOM_MEDIA_ID}-03`,
    url: `/images/rooms/${STATIC_ROOM_MEDIA_ID}/03-twin-beds.png`,
    altText: "Dua tempat tidur dengan panel kayu dan pencahayaan hangat",
    isCover: false,
    sortOrder: 1,
  },
  {
    id: `${STATIC_ROOM_MEDIA_ID}-04`,
    url: `/images/rooms/${STATIC_ROOM_MEDIA_ID}/04-living-area.png`,
    altText: "Area duduk dan fasilitas kamar",
    isCover: false,
    sortOrder: 2,
  },
];

export const secondStaticRoomImages = [
  {
    id: `${SECOND_STATIC_ROOM_MEDIA_ID}-01`,
    url: `/images/rooms/${SECOND_STATIC_ROOM_MEDIA_ID}/01-room.png`,
    altText: "Kamar dengan tempat tidur dan interior bernuansa hangat",
    isCover: true,
    sortOrder: 0,
  },
  {
    id: `${SECOND_STATIC_ROOM_MEDIA_ID}-02`,
    url: `/images/rooms/${SECOND_STATIC_ROOM_MEDIA_ID}/02-twin-beds.png`,
    altText: "Dua tempat tidur dengan wallpaper bermotif dedaunan",
    isCover: false,
    sortOrder: 1,
  },
  {
    id: `${SECOND_STATIC_ROOM_MEDIA_ID}-03`,
    url: `/images/rooms/${SECOND_STATIC_ROOM_MEDIA_ID}/03-window-view.png`,
    altText: "Jendela kamar yang menghadap area luar Darajat Pass",
    isCover: false,
    sortOrder: 2,
  },
];

export const thirdStaticRoomImages = [
  {
    id: `${THIRD_STATIC_ROOM_MEDIA_ID}-01`,
    url: `/images/rooms/${THIRD_STATIC_ROOM_MEDIA_ID}/01-twin-room.png`,
    altText: "Kamar twin dengan panel kayu dekoratif dan pencahayaan hangat",
    isCover: true,
    sortOrder: 0,
  },
  {
    id: `${THIRD_STATIC_ROOM_MEDIA_ID}-02`,
    url: `/images/rooms/${THIRD_STATIC_ROOM_MEDIA_ID}/02-room-view.png`,
    altText: "Kamar dengan jendela besar dan pemandangan kawasan Darajat Pass",
    isCover: false,
    sortOrder: 1,
  },
  {
    id: `${THIRD_STATIC_ROOM_MEDIA_ID}-03`,
    url: `/images/rooms/${THIRD_STATIC_ROOM_MEDIA_ID}/03-bathtub.png`,
    altText: "Kamar mandi dengan bathtub sudut",
    isCover: false,
    sortOrder: 2,
  },
  {
    id: `${THIRD_STATIC_ROOM_MEDIA_ID}-04`,
    url: `/images/rooms/${THIRD_STATIC_ROOM_MEDIA_ID}/04-bathroom.png`,
    altText: "Area toilet dengan pencahayaan hangat",
    isCover: false,
    sortOrder: 3,
  },
];

export const fourthStaticRoomImages = [
  {
    id: `${FOURTH_STATIC_ROOM_MEDIA_ID}-01`,
    url: `/images/rooms/${FOURTH_STATIC_ROOM_MEDIA_ID}/01-room.png`,
    altText: "Kamar dengan tempat tidur besar dan panel dekoratif bernuansa kayu",
    isCover: true,
    sortOrder: 0,
  },
  {
    id: `${FOURTH_STATIC_ROOM_MEDIA_ID}-02`,
    url: `/images/rooms/${FOURTH_STATIC_ROOM_MEDIA_ID}/02-shower.png`,
    altText: "Kamar mandi dengan area shower berpintu kaca",
    isCover: false,
    sortOrder: 1,
  },
  {
    id: `${FOURTH_STATIC_ROOM_MEDIA_ID}-03`,
    url: `/images/rooms/${FOURTH_STATIC_ROOM_MEDIA_ID}/03-balcony-seating.png`,
    altText: "Area duduk balkon dengan dua kursi dan meja kayu",
    isCover: false,
    sortOrder: 2,
  },
];

export const staticRoomImagesById = {
  [STATIC_ROOM_MEDIA_ID]: staticRoomImages,
  [SECOND_STATIC_ROOM_MEDIA_ID]: secondStaticRoomImages,
  [THIRD_STATIC_ROOM_MEDIA_ID]: thirdStaticRoomImages,
  [FOURTH_STATIC_ROOM_MEDIA_ID]: fourthStaticRoomImages,
};
