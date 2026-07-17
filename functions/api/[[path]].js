export async function onRequest({request}) {
 const ip=request.headers.get("CF-Connecting-IP");
 const cf=request.cf||{};
 const url=new URL(request.url);
 if(url.pathname.endsWith("/ip")) return new Response(ip,{headers:{"content-type":"text/plain","Access-Control-Allow-Origin":"*"}});
 return Response.json({ip,city:cf.city??null,region:cf.region??null,country:cf.country??null,continent:cf.continent??null,timezone:cf.timezone??null,latitude:cf.latitude??null,longitude:cf.longitude??null,asn:cf.asn??null,organization:cf.asOrganization??null,colo:cf.colo??null,userAgent:request.headers.get("User-Agent"),timestamp:new Date().toISOString()},{headers:{"Access-Control-Allow-Origin":"*","Cache-Control":"no-store"}});
}