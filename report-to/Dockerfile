ARG BUILD_FROM=ghcr.io/hassio-addons/base/amd64

# https://github.com/hassio-addons/addon-base/releases
FROM ${BUILD_FROM}:9.2.0

# Bring in our package.json and set workdir
COPY package.json /opt/
WORKDIR /opt

# Set everything up
RUN set -eux; \
    apk update; \
    apk add --no-cache \
        nodejs=14.16.1-r1 \
        npm=14.16.1-r1 \
        ; \
    node --version; \
    \
    npm install \
        --no-audit \
        --no-optional \
        --no-update-notifier \
        --only=production \
        --unsafe-perm \
        ; \
        npm cache clear --force; \
    \
    echo "Add user for report-to app"; \
    addgroup -S abc; \
    adduser -u 12345 -h /data/ -D -S abc -G abc;

# Copy in root filesystem
COPY rootfs /

# Build arguments
ARG BUILD_ARCH
ARG BUILD_DATE
ARG BUILD_DESCRIPTION
ARG BUILD_NAME
ARG BUILD_REF
ARG BUILD_REPOSITORY
ARG BUILD_VERSION

# Labels
LABEL \
    io.hass.name="${BUILD_NAME}" \
    io.hass.description="${BUILD_DESCRIPTION}" \
    io.hass.arch="${BUILD_ARCH}" \
    io.hass.type="addon" \
    io.hass.version=${BUILD_VERSION} \
    maintainer="mdegat01" \
    org.opencontainers.image.title="${BUILD_NAME}" \
    org.opencontainers.image.description="${BUILD_DESCRIPTION}" \
    org.opencontainers.image.vendor="mdegat01's Home Assistant Add-ons" \
    org.opencontainers.image.authors="mdegat01" \
    org.opencontainers.image.licenses="MIT" \
    org.opencontainers.image.url="https://github.com/mdegat01/hassio-addons" \
    org.opencontainers.image.source="https://github.com/${BUILD_REPOSITORY}" \
    org.opencontainers.image.documentation="https://github.com/${BUILD_REPOSITORY}/blob/main/README.md" \
    org.opencontainers.image.created=${BUILD_DATE} \
    org.opencontainers.image.revision=${BUILD_REF} \
    org.opencontainers.image.version=${BUILD_VERSION}
