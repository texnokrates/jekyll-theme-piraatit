FROM jekyll/jekyll:3.7.3

# Install ImageMagick
RUN apk --no-cache add \
    file \
    imagemagick \
    curl

CMD ["jekyll", "--help"]

ENTRYPOINT ["/usr/jekyll/bin/entrypoint"]

WORKDIR /srv/jekyll

VOLUME  /srv/jekyll

EXPOSE 35729
EXPOSE 3000
EXPOSE 4000
